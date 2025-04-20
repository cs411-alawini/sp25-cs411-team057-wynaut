import React from "react";
import InputBox, { ItemInput } from "../components/itemBox";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const AddReceipt: React.FC = () => {
    async function submitReceipt(inputs: ItemInput[]) {
        //Do something here
        console.log(inputs);

        const message = "Please enter a userID to store this with.";
        let promptedValue = -1;
        while (true) {
            const input = prompt(message);
            if (input === null) { //Canceled
                return;
            }
            const num = Number(input);
            if (!isNaN(num)) {
                promptedValue = num;
                break;
            }
            console.log(num);
            alert("Invalid input. Please enter a number.");
        }

        console.log(promptedValue);
        const data = [inputs, promptedValue];
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
