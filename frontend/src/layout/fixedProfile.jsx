import React from "react";

const dataProfile = [{
    name: "Alia",
    username: "cobauname",
    phone: "081111111111",
    email: "cobaemail@mail.com",
},]


const FixedProfile = () => {
    return (
        <div>
            <div>
                <h1 className="welcome-mess">
                    Welcome!
                </h1>
            </div>
            <div className="data-list">
                {dataProfile.map((datap) => (
                    <div className="list">
                        <h2>Name       : Alia</h2>
                        <h2>Username   : cobauname</h2>
                        <h2>Phone      : 081111111111</h2>
                        <h2>Email      : cobaemail@mail.com</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FixedProfile;