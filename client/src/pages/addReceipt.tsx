import React, { JSX, useState, useEffect } from "react";
import Itembox from "../components/itemBox";
import Userbox from "../components/userBox";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import {
    UsernameInput,
    ItemInput,
    UserInput,
    CategoryInput,
} from "../components/interfaces";

const AddReceipt = ({ username }: UsernameInput): JSX.Element => {
    const [selected, setSelect] = useState(-1); //-1 No button selected; Any other number is index
    const [userItems, setUserItems] = useState<number[][]>([[]]);
    const [itemsUser, setItemsUser] = useState<number[]>([0]);
    const [userInputs, setUserInputs] = useState([username, ""]);

    const [data, setData] = useState<Array<any>>([]); //Its an array like this [[CategoryInput, index],[CategoryInput, index]...];
    // index = -1 for new categories and ordered 0->length-1 for existing ones
    const [loaded, setLoaded] = useState(false);


    
    async function getCategories() {
        try {
            const response = await fetch("http://localhost:3001/ViewCategory", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "Get",
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Response
            const json: Array<CategoryInput> = await response.json();
            let curr_data = [...data];
            curr_data.splice(0);
            for (let i = 0; i < json.length; i++) {
                curr_data.push([json[i], i]);
            }
            setData(curr_data);
            setLoaded(true);
        } catch (error) {
            console.error((error as Error).message);
        }

        //TEST CODE
        let test_data: Array<CategoryInput> = [
            { category: "test1", budget: 10, spent: 13 },
            { category: "test2", budget: 12, spent: 11 },
            { category: "test3", budget: 14, spent: 16 },
            { category: "test4", budget: 15, spent: 14 },
            { category: "test5", budget: 16, spent: 21 },
        ];
        let curr_data = [...data];
        curr_data.splice(0);
        for (let i = 0; i < test_data.length; i++) {
            curr_data.push([test_data[i], i]);
        }
        setData(curr_data);
        setLoaded(true);
        //_____

        console.log("HERE");
    }

    async function submitReceipt(inputs: ItemInput[]) {
        //Do something here
        let newItemContributes: Array<Array<string>> = [];
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

        const data = { user: username, items: newItemInputs };
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

    useEffect(() => {
            getCategories();
        }, []); // Empty dependency array ensures the effect runs only once on mount

    if (username == "") {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h1 className="container">
                <div className="general-outline">
                    New Receipt
                    <Link to="/">
                        <button className="input-button">Return to Home</button>
                    </Link>
                </div>
            </h1>
            <div className="container3">
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
                    data={data}
                    setData={setData}
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
