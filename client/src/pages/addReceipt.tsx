import React, {JSX} from "react";
import InputBox, { ItemInput } from "../components/itemBox";
import { BrowserRouter as Router, Routes, Route, Link, Navigate  } from "react-router-dom";

interface userIn{
    userID: number
}

const AddReceipt = ({userID} : userIn): JSX.Element => {

    if (userID == 0) {
        return <Navigate to='/'  />
    }
    async function submitReceipt(inputs: ItemInput[]) {
        //Do something here
        console.log(inputs);

        const data = [inputs, userID];
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
            <InputBox onSubmit={submitReceipt} />
        </div>
    );

};

export default AddReceipt;
