import React, { JSX, useState } from "react";
import Itembox, { ItemInput } from "../components/itemBox";
import Userbox, { UserInput } from "../components/userBox";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";

interface AddReceiptInput {
    username: string;
}

const AddReceipt = ({ username }: AddReceiptInput): JSX.Element => {
    const [selected, setSelect] = useState(-1); //-1 No button selected; Any other number is index
    const [userItems, setUserItems] = useState<number[][]>([[]]);
    const [itemsUser, setItemsUser] = useState<number[]>([0]);
    const [userInputs, setUserInputs] = useState([username, ""]);

    if (username == "") {
        return <Navigate to="/" />;
    }
    async function submitReceipt(inputs: ItemInput[]) {
        //Do something here
        let newItemContributes : Array<Array<string>> = [];
        for (let i = 0; i < inputs.length; i++) {
            newItemContributes.push([]);
        }
        for (let i = 0; i < userItems.length; i++) {
            for (let j = 0; j < userItems[i].length; j++) {
                newItemContributes[userItems[i][j]].push(userInputs[i]);
            }
        }

        let newItemInputs = [];

        for (let i = 0; i < inputs.length; i++) {
            let curr: ItemInput = inputs[i];
            newItemInputs.push({
                name: curr.name,
                price: curr.price,
                amount: curr.amount,
                contributes: newItemContributes[i],
            });
        }

        const data = [username, newItemInputs];
        console.log(data);
        try {
            const response = await fetch("http://localhost:3001/AddReceipt", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify(data),
            });
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
                <Userbox
                    userInputs={userInputs}
                    setUserInputs={setUserInputs}
                    selected={selected}
                    setSelect={setSelect}
                    userItems={userItems}
                    setUserItems={setUserItems}
                    itemsUser={itemsUser}
                    setItemsUser={setItemsUser}
                />
                <Itembox
                    onSubmit={submitReceipt}
                    selected={selected}
                    setSelect={setSelect}
                    userItems={userItems}
                    setUserItems={setUserItems}
                    itemsUser={itemsUser}
                    setItemsUser={setItemsUser}
                />
            </div>
        </div>
    );
};

export default AddReceipt;
