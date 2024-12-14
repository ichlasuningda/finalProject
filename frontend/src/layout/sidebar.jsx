import React from 'react';
import Logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaUser, FaHome, FaShoppingBasket } from "react-icons/fa"
import { IoLogOut } from "react-icons/io5";
import "./sidebar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className='menu'>
            <div className='up-menu-logo'>
                <NavLink to="/profile" className="imgItem">
                    <img src={Logo} width='110' height='70' alt='Logo' />
                </NavLink>
            </div>
            <div className='menu-list-button'>
                <button className="side-button">
                    <FaHome className="side-icon" />
                    Home
                </button>
                <button className="side-button">
                    <FaShoppingBasket className="side-icon" />
                    Cart
                </button>
                <button className="side-button">
                    <FaUser className="side-icon" />
                    Profile
                </button>
                <button className="side-button" onClick={() => navigate('/')}>
                    <IoLogOut className="side-icon" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar;