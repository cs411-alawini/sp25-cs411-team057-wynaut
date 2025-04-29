import React, { JSX, useState, useEffect } from "react";
import { UsernameInput } from "../components/interfaces";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";

const AddIncome = ({ username }: UsernameInput): JSX.Element => {
    const [loaded, setLoaded] = useState(false);
    const [income, setIncome] = useState(0);



    async function loadIncome() {
        try {
            const response = await fetch("http://localhost:3001/getIncome", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify({ username: username }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            setIncome(await response.json());
            setLoaded(true);
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    async function submitIncome() {
        try {
            const response = await fetch("http://localhost:3001/addIncome", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify({ username: username, income: income }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    useEffect(() => {
        loadIncome();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    if (username == "") {
        //To stop people from bypassing login
        return <Navigate to="/" />;
    }

    return (
        <div className="container">
            <div className="general-outline">
                Add Annual Income
                <Link to="/">
                    <button className="input-button">Return to Home</button>
                </Link>
            </div>

            {!loaded && <text> Loading... </text>}
            {loaded && (
                <div className="general-outline">
                    <button className="general-outline" style={{ margin: 10 }} onClick={submitIncome}>
                        Submit
                    </button>
                    <input
                        className="general"
                        value={"Annual Income:"}
                        style={{ margin: 10 }}
                        readOnly
                    ></input>
                    <input
                        className="general-outline"
                        value={income}
                        onChange={(event) => {
                            if (!isNaN(Number(event.target.value))) {
                                setIncome(parseInt(event.target.value));
                            }
                            if (event.target.value === "") {
                                setIncome(0);
                            }
                        }}
                    ></input>
                </div>
            )}
        </div>
    );
};

export default AddIncome;
