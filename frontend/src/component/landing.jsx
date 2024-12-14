import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import { FiArrowRight } from "react-icons/fi";

export const Landing = () => {
    const navigate = useNavigate();

    return(
        <div className="landing-page">
            <h1 className="home-quote">
                Get Your Daily Dose 
                of Caffeine Now!
            </h1>
            <button className="landing-login" onClick={() => navigate('/login')}>
                Order Now <FiArrowRight />
            </button>
        </div>
    )
}