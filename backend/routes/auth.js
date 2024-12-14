const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Endpoint untuk registrasi
router.post('/register', async (req, res) => {
    const { name, uname, phone, email, pass} = req.body;

    // Validasi input
    if ( !name || !uname || !phone || !email || !pass ) {
        return res.status(400).json({ message: 'Periksa kembali dan isi semua data yang diperlukan.' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Email tidak valid.' });
    }
    if (!validator.isMobilePhone(phone, 'id-ID')) { // 'id-ID' untuk validasi nomor telepon Indonesia
        return res.status(400).json({ message: 'Nomor HP tidak valid.' });
    }
    if (pass.length < 8) {
        return res.status(400).json({ message: 'Password minimal 8 karakter.' });
    }

    try {
        // Cek apakah email sudah digunakan
        const [existingEmail] = await db.execute(
            'SELECT * FROM cust_user WHERE email = ?', [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        // Cek apakah username sudah digunakan
        const [existingUname] = await db.execute(
            'SELECT * FROM cust_user WHERE username = ?', [uname]
        );

        if (existingUname.length > 0) {
            return res.status(400).json({ message: 'Username sudah digunakan.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(pass, 10);

        // Simpan user ke database
        await db.execute(
            'INSERT INTO cust_user (name, username, phone, email, password) VALUES (?, ?, ?, ?, ?)',
            [name, uname, phone, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//Endpoint Login
router.post('/login', async(req, res) => {
    const {uname, pass} = req.body;

    //Validasi input
    if (!uname || !pass){
        return res.status(400).json({message: 'Harap isikan username dan password.'});
    }

    let userId;
    try{
        //Cek username
        const [userUname] = await db.execute('SELECT * FROM cust_user WHERE username = ?', [uname]);
        if (userUname.length === 0){
            return res.status(400).json({message: 'Username yang anda masukkan tidak terdaftar.'});
        }

        const foundUser = userUname[0];
        userId = foundUser.username;

        //Cek Blokir
        if (foundUser.suspended){
            return res.status(403).json({message: "Akun anda terblokir, silahkan hubungi Customer Service."});
        }

        //Cek password
        const isPassMatch = await bcrypt.compare(pass, foundUser.password);
        if (!isPassMatch){
            //Tambah percobaan login
            await db.execute(
                'UPDATE cust_user SET login_attempt = login_attempt + 1 WHERE username = ?', [userId]
            );

            //Jika percobaan mencapai 3, blokir akun
            if (foundUser.login_attempt + 1 >= 3){
                await db.execute(
                    'UPDATE cust_user SET suspended = TRUE WHERE username = ?', [userId]
                );
                return res.status(403).json({message: 'Anda telah gagal melakukan login 3 kali, akun anda ditangguhkan. Silahkan hubungi Customer Service'});                
            }
            return res.status(400).json({message: 'Password yang anda masukkan salah.'});
        }

        //Reset login_attempt jika login berhasil
        await db.execute(
            'UPDATE cust_user SET login_attempt = 0 WHERE username = ?',
            [userId]
        );

        res.status(200).json({message: 'Login Berhasil!'});

    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message}); 
    } finally {
        //Reset login_attemp jika koneksi putus
        res.on('finish', async () => {
            if (userId){
                try{
                    await db.execute(
                        'UPDATE cust_user SET login_attempt = 0 WHERE username = ?',
                        [userId]
                    );
                } catch (error) {
                    console.error('Error saat mereset login_attempt: ', error.message);
                }
            }
        });
    }
});

//Endpoint memperbarui informasi akun
router.put('/update-profile', async(req, res) => {
    const {uname, newUname, phone, email, pass} = req.body;

    //Validasi input
    if (newUname && newUname.length < 4){
        return res.status(400).json({message: 'Username minimal 4 karakter.'});
    }
    if (phone && !validator.isMobilePhone(phone, 'id-ID')){
        return res.status(400).json({message: 'Harap masukkan nomor HP yang valid'});
    }
    if (email && !validator.isEmail(email)){
        return res.status(400).json({message: 'Harap masukkan Email yang valid'});
    }
    if (pass && pass.length < 8){
        return res.status(400).json({message: 'Password minimal 8 karakter.'});
    }

    try{
        const [user] = await db.execute('SELECT * FROM cust_user WHERE username = ?', [uname]);
        if (user.length === 0){
            return res.status(404).json({message: 'User tidak ditemukan.'});
        }

        const foundUser = user[0]
        const updates = []
        const params = []

        //Perubahan username
        if (newUname && newUname !== foundUser.username){
            const lastChangeDate = new Date(foundUser.last_uname_change);
            const currentDate = new Date()

            //Cek terakhir ganti username
            if (foundUser.last_uname_change){
                const daysChange = Math.floor((currentDate - lastChangeDate) / (1000*60*60*24));

                if (daysChange <= 30){
                    return res.status(400).json({message: 'Username hanya dapat diubah satu kali dalam 30 hari.'});
                }
            }
            updates.push('username = ?');
            params.push(newUname);
            updates.push('last_uname_change = ?');
            params.push(currentDate);
        }

        //Perubahan nomor HP
        if (phone && phone !== foundUser.phone){
            updates.push('phone = ?')
            params.push(phone)
        }

        //Perubahan email
        if (email && email !== foundUser.email){
            updates.push('email = ?')
            params.push(email)
        }

        //Perubahan password
        const isPassMatch = await bcrypt.compare(pass, foundUser.password)
        if (pass && !isPassMatch){
            const hashedPassword = await bcrypt.hash(pass, 10);
            updates.push('password = ?')
            params.push(hashedPassword)
        }

        //Tidak ada perubahan
        if (updates.length === 0){
            return res.status(400).json({message: 'Tidak ada perubahan data.'});
        }

        //Update data di database
        params.push(uname);
        const query = `UPDATE cust_user SET ${updates.join(', ')} WHERE username = ?`;
        await db.execute(query, params);

        res.status(200).json({message: 'Profil berhasil diperbarui.'})
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

module.exports = router;