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

    if (username == "") {
        return <Navigate to="/" />;
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
                    username={username}
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
