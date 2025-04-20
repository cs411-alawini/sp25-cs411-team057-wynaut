import { log } from "console";
import React, { useState, JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IDstate } from "../App";
interface loginType {
    username: string;
    password: string;
}

const HomePage = ({ userID, setUserID }: IDstate): JSX.Element => {
    console.log(userID);
    const [loginInfo, setLogin] = useState({ username: "", password: "" });
    const [loginStatus, setStatus] = useState(0); //0 = not login yet 1 = in process 2 = logged in

    const buttonText = () => {
        //Shows when trying to login
        if (loginStatus == 0) {
            return "Login";
        } else {
            return "Logging In...";
        }
    };

    const changePassword = (event: any) => {
        //Update the password based on input
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
        //Hides the password with *
        return "*".repeat(loginInfo.password.length);
    };

    async function tryLogin() {
        //Sends the user and pass to backend
        setStatus(1);

        try {
            const response = await fetch("http://localhost:3001/login", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify(loginInfo),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let new_id = JSON.parse(await response.json());

            console.log(new_id);

            if (new_id) {
                setStatus(2); //Move this where we test if it works

                setUserID(new_id);
            } else {
                setStatus(0);
            }

            // Do something to check if it works?
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    if (userID == 0 && loginStatus != 2) {
        //No userID set and hasn't logged in yet
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
                        // value={hidePassword(loginInfo.password)}
                        // onChange={changePassword}
                        value={loginInfo.password}
                        onChange={(event) => {
                            setLogin((currloginInfo) => ({
                                ...currloginInfo,
                                password: event.target.value,
                            }));
                            console.log({
                                ...loginInfo,
                                password: event.target.value,
                            });
                        }}
                        className="general-outline"
                    />
                </div>

                <button className="input-button" onClick={tryLogin}>
                    {buttonText()}
                </button>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1> Home Page :D</h1>
                <Link to="/AddReceipt">
                    <button className="input-button">
                        Manual Receipt Adder
                    </button>
                </Link>
            </div>
        );
    }
};

export default HomePage;
