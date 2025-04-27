import React, { JSX } from "react";
import Itembox, { ItemInput } from "../components/itemBox";
import Userbox, { UserInput } from "../components/userBox";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";

interface userIn {
    username: string;
}

const AddReceipt = ({ username }: userIn): JSX.Element => {
    if (username == "") {
        return <Navigate to="/"/>;
    }
    async function submitReceipt(inputs: ItemInput[]) {
        //Do something here
        console.log(inputs);

        const data = [inputs, username];
        try {
            const response = await fetch("http://localhost:3001/addReceipt", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify(data),
            });
            console.log("GOT HERE");
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json.status);
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    return (
        <div>
            <h1 className="container">
                <div className="general-outline">
                    Receipt Manual Inputter
                    <Link to="/">
                        <button className="input-button">Return to Home</button>
                    </Link>
                </div>
            </h1>
            <div className="container2">
                <Userbox username={username}/>
                <Itembox onSubmit={submitReceipt} />
            </div>
        </div>
    );
};

export default AddReceipt;
