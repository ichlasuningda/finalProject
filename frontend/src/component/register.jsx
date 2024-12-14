import React from "react"
import { useNavigate } from "react-router-dom";
import "./register.css";
import { FaUser, FaLock, FaAt, FaPhone } from "react-icons/fa"
import { IoIosMail } from "react-icons/io";

export const Register = () => {
    const navigate = useNavigate();

    return(
        <div className="register-page">
            <form>
                <div className="reg-wrapper">
                    <h1>Register</h1>
                    <div className="reg-input-box">
                        <FaUser className="reg-icon" />
                        <input type="text" placeholder="Name" id="name" name="name" required/>
                    </div>
                    <div className="reg-input-box">
                        <FaAt className="reg-icon" />
                        <input type="text" placeholder="Username" id="uname" name="uname" required/>
                    </div>
                    <div className="reg-input-box">
                        <FaPhone className="reg-icon" />
                        <input type="text" placeholder="Phone Number" id="phone" name="phone" required/>
                    </div>
                    <div className="reg-input-box">
                        <IoIosMail className="reg-icon" />
                        <input type="email" placeholder="Email" id="email" name="email" required/>
                    </div>
                    <div className="reg-input-box">
                        <FaLock className="reg-icon" />
                        <input type="password" placeholder="Password" id="pass" name="pass" required/>                      
                    </div>
                    <div className="reg-input-box">
                        <FaLock className="reg-icon" />
                        <input type="password" placeholder="Confirm Password" id="passCheck" name="passCheck" required/>
                    </div>
                    <button className="submit-register">Regist Me</button>

                    <div>
                        <button className="register-to-login" onClick={() => navigate('/login')}>
                        Already have an account? Login now.
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}