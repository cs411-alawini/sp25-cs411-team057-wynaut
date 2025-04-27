import { log } from "console";
import React, { useState, JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserState } from "../components/interfaces";

const HomePage = ({ username, setUsername }: UserState): JSX.Element => {
    console.log(username);

    const [loginInfo, setInfo] = useState({ username: "", password: "" });
    const [loginStatus, setLogin] = useState(2); //-1 = failed to login 0 = not login yet 1 = in process 2 = logged in
    const [createStatus, setCreate] = useState(0); //-1 = failed to create 0 = not created yet 1 = in process 2 = created

    const buttonTextLogin = () => {
        //Shows when trying to login
        if (loginStatus <= 0) {
            return "Login";
        } else if (loginStatus == 1) {
            return "Logging In...";
        }
    };

    const buttonTextCreate = () => {
        //Shows when trying to login
        if (createStatus != 1) {
            return "Create Account";
        } else {
            return "Creating...";
        }
    };

    const buttonResponse = () => {
        let text: string = "";
        if (loginStatus == -1) {
            text = "Login failed";
        }
        if (createStatus == -1) {
            text = "Could not create account";
        }
        if (createStatus == 2) {
            text = "Account Created";
        }
        return <text> {text} </text>;
    };

    async function tryLogin() {
        setLogin(1);
        setCreate(0);

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
                setLogin(2); 

                setUsername(loginInfo.username);
            } else {
                setLogin(-1);
            }

        } catch (error) {
            console.error((error as Error).message);
            setLogin(-1);
        }
    }

    async function tryCreate() {
        setLogin(0);
        setCreate(1);

        try {
            const response = await fetch("http://localhost:3001/login", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify(loginInfo),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                setCreate(2);
            }
            
        } catch (error) {
            console.error((error as Error).message);
            setCreate(-1);
        }
    }

    if (username == "" && loginStatus != 2) {
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
                            setInfo((currloginInfo) => ({
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
                        value={loginInfo.password}
                        onChange={(event) => {
                            setInfo((currloginInfo) => ({
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

                <div className="input-box">
                    <button className="input-button" onClick={tryLogin}>
                        {buttonTextLogin()}
                    </button>

                    <button className="input-button" onClick={tryCreate}>
                        {buttonTextCreate()}
                    </button>
                </div>

                {buttonResponse()}
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1> Home Page :D</h1>
                <Link to="/AddReceipt">
                    <button className="input-button">
                        Add New Receipt
                    </button>
                </Link>
                <Link to="/ViewCategory">
                    <button className="input-button">
                        View Categories
                    </button>
                </Link>
                <Link to="/ViewReceipt">
                    <button className="input-button">
                        View Previous Receipts 
                    </button>
                </Link>
            </div>
        );
    }
};

export default HomePage;
