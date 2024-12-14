import React from "react";
import Sidebar from "./sidebar";
import './frame.css'

const Frame = ({ children }) => {
    return (
        <div className="profile-frame">
            <Sidebar />
            <div className="content">
                <main>{children}</main>
            </div>
        </div>
    );
};

export default Frame;