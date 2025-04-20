import { log } from "console";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

interface loginType {
    username: string;
    password: string;
}

const HomePage: React.FC = () => {
    const [loginInfo, setLogin] = useState({ username: "", password: "" });

    const changePassword = (event: any) => {
        let value: string = event.target.value;
        let curr_pass: string = loginInfo.password;
        if (value.length > curr_pass.length) {
            //Added char
            curr_pass += value[value.length - 1];
        } else {
            //Removed char
            curr_pass = curr_pass.substring(0, value.length);
        }

        setLogin((currloginInfo) => ({
            ...currloginInfo,
            password: curr_pass,
        }));
        console.log({ ...loginInfo, password: curr_pass });
    };

    const hidePassword = (pass: string) => {
        return "*".repeat(loginInfo.password.length);
    };

    async function tryLogin(){
        try {
            const response = await fetch("http://localhost:3001/login", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify(loginInfo),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json.status);


            // Do something to check if it works?
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return (
        <div className="container">
            <div className="input-box">
                <text className="general-outline">Username</text>
                <input
                    name="Username"
                    type="text"
                    value={loginInfo.username}
                    onChange={(event) => {
                        setLogin((currloginInfo) => ({
                            ...currloginInfo,
                            username: event.target.value,
                        }));
                        console.log({
                            ...loginInfo,
                            username: event.target.value,
                        });
                    }}
                    className="general-outline"
                />
            </div>

            <div className="input-box">
                <text className="general-outline">Password</text>
                <input
                    name="Password"
                    type="text"
                    value={hidePassword(loginInfo.password)}
                    onChange={changePassword}
                    className="general-outline"
                />
            </div>

            <button className="input-button" onClick={tryLogin}>
                Login
            </button>
        </div>
    );

    return (
        <div className="container">
            <h1> Home Page :D</h1>
            <Link to="/AddReceipt">
                <button className="input-button">Manual Receipt Adder</button>
            </Link>
        </div>
    );
};

export default HomePage;
