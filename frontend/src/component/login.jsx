import React, {useState} from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./login.css";
import { FaUser, FaLock } from "react-icons/fa"

function Login() {
    const navigate = useNavigate();

    const [uname, setUname] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {uname, pass});
            if (response.status === 200){
                localStorage.setItem("name", response.data.name);
                navigate('/profile');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <div className="wrapper">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" onChange={e => setUname(e.target.value)} required/>
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} required/>
                        <FaLock className="icon" />
                    </div>

                    <button type="submit" className="submit-login">
                        Login
                    </button>

                    <div>
                        <button className="login-to-register" onClick={() => navigate('/register')}>
                        Don't have an account? Register here.
                        </button>
                    </div>
                    </div>
            </form>
        </div>
    )
}

export default Login;