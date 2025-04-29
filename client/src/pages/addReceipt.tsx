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
    UserReceiptState,
    ItemInput,
    UserInput,
    CategoryInput,
    BillSplit,
} from "../components/interfaces";

export const selected_button_color = "rgb(128, 191, 192)";

const AddReceipt = ({
    username,
    setUsername,
    receiptID,
    setReceiptID,
}: UserReceiptState): JSX.Element => {
    const [selected, setSelect] = useState(-1); //-1 No button selected; Any other number is index
    const [userItems, setUserItems] = useState<number[][]>([[]]); //user : items that they have //----
    const [itemsUser, setItemsUser] = useState<number[]>([0]); //Amt of users per item //----
    const [userInputs, setUserInputs] = useState([username, ""]); //----
    const [data, setData] = useState<Array<CategoryInput>>([]); //Its an array like this [CategoryInput]; diff from the one in viewCategories
    const [inputs, setInputs] = useState<Array<ItemInput>>([
        { name: "Enter Item Name", price: "0.00", amount: 0, category: "" },
    ]); //----

    const [loaded, setLoaded] = useState(false);
    const [seller, setSeller] = useState(""); //----
    const [submitStatus, setSubmitStatus] = useState(0); //0 is no err; 1 is no seller

    const [displayStatus, setDisplayStatus] = useState(0);
    const [billSplit, setBillSplit] = useState<Array<BillSplit>>([]);
    const [overspend, setOverspend] = useState<Array<CategoryInput>>([]);

    async function loadReceipt() {
        console.log("LOADING RECEIPT");
        try {
            const response = await fetch("http://localhost:3001/GetReceipt", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "Post",
                body: JSON.stringify({ receipt: receiptID }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            // { user: username, seller: seller, items: newItemInputs }
            const json: any = await response.json();
            setSeller(json.seller);

            let userItemdict: { [id: string]: Array<number> } = {};
            let user_set = new Set<string>();
            let new_itemsUser = [...itemsUser];
            new_itemsUser.splice(0);
            let new_inputs = [...inputs];
            new_inputs.splice(0);

            for (let i = 0; i < json.items.length; i++) {
                //get all items
                let curr_item = json.items[i];

                for (let j = 0; j < curr_item.contributes.length; j++) {
                    // get all users for each item
                    let curr_user = curr_item.contributes[j];

                    if (!(curr_user in userItemdict)) {
                        userItemdict[curr_user] = [];
                    }
                    userItemdict[curr_user].push(i);
                    user_set.add(curr_user);
                }
                new_itemsUser.push(json.items[i].contributes.length);
                new_inputs.push({
                    name: curr_item.name,
                    price: curr_item.price,
                    amount: curr_item.amount,
                    category: curr_item.category,
                });
            }
            setInputs(new_inputs);
            user_set.delete(username);
            setItemsUser(new_itemsUser);

            let new_userItems = [...userItems];
            let new_userInputs = [...userInputs];
            new_userInputs.splice(1);
            user_set.forEach((element) => {
                new_userItems.push([]);
                new_userInputs.push(element);
            });
            setUserInputs([...new_userInputs, ""]);

            console.log(userItemdict);
            for (let i = 0; i < new_userInputs.length; i++) {
                new_userItems[i] = userItemdict[new_userInputs[i]];
            }
            setUserItems(new_userItems);
        } catch (error) {
            console.error((error as Error).message);
        }

        // TESTING ------------
        // let newItemInputs = [
        //     {
        //         name: "Lost",
        //         price: 1,
        //         amount: 2,
        //         category: "",
        //         contributes: ["Test"],
        //     },
        //     {
        //         name: "Lost2",
        //         price: 3,
        //         amount: 4,
        //         category: "test1",
        //         contributes: ["Test2"],
        //     },
        // ];

        // let test_data = {
        //     user: username,
        //     seller: "testingSeller",
        //     items: newItemInputs,
        // };

        // const json: any = test_data;
        // setSeller(json.seller);

        // let userItemdict: { [id: string]: Array<number> } = {};
        // let user_set = new Set<string>();
        // let new_itemsUser = [...itemsUser];
        // new_itemsUser.splice(0);
        // let new_inputs = [...inputs];
        // new_inputs.splice(0);

        // for (let i = 0; i < json.items.length; i++) {
        //     //get all items
        //     let curr_item = json.items[i];
        //     console.log("item", curr_item)

        //     for (let j = 0; j < curr_item.contributes.length; j++) {
        //         // get all users for each item
        //         let curr_user = curr_item.contributes[j];
        //         console.log("user", curr_user)

        //         if (!(curr_user in userItemdict)) {
        //             userItemdict[curr_user] = [];
        //         }
        //         userItemdict[curr_user].push(i);
        //         user_set.add(curr_user);
        //     }
        //     new_itemsUser.push(json.items[i].contributes.length);
        //     new_inputs.push({
        //         name: curr_item.name,
        //         price: curr_item.price,
        //         amount: curr_item.amount,
        //         category: curr_item.category,
        //     });
        // }
        // setInputs(new_inputs);
        // user_set.delete(username);
        // setItemsUser(new_itemsUser);

        // let new_userItems = [...userItems];
        // let new_userInputs = [...userInputs];
        // new_userInputs.splice(1)
        // user_set.forEach((element) => {
        //     new_userItems.push([]);
        //     new_userInputs.push(element);
        // });
        // setUserInputs([...new_userInputs, ""]);

        // console.log(userItemdict);
        // for (let i = 0; i < new_userInputs.length; i++) {
        //     console.log(new_userInputs[i], userItemdict[new_userInputs[i]])
        //     new_userItems[i] = userItemdict[new_userInputs[i]];
        // }
        // setUserItems(new_userItems);
        // console.log("new_itemsUser", new_itemsUser)
        // console.log("new_userItems", new_userItems)
        // console.log("new_userInputs", new_userInputs)
        // console.log("new_inputs", new_inputs)
        // console.log("seller", json.seller)
        // -------------------
    }
    async function getCategories() {
        try {
            const response = await fetch("http://localhost:3001/ViewCategory", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify({ user: username }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Response
            const json: Array<CategoryInput> = await response.json();
            let curr_data = [...data];
            curr_data.splice(0);
            setData([...curr_data, ...json]);
            setLoaded(true);
        } catch (error) {
            console.error((error as Error).message);
        }

        //TEST CODE
        // let test_data: Array<CategoryInput> = [
        //     { Category: "test1", Budget: 10, Spent: 13 },
        //     { Category: "test2", Budget: 10, Spent: 13 },
        //     { Category: "test3", Budget: 10, Spent: 13 },
        //     { Category: "test4", Budget: 10, Spent: 13 },
        //     { Category: "test5", Budget: 10, Spent: 13 },
        // ];
        // let curr_data = [...data];
        //     curr_data.splice(0);
        //     setData([...curr_data, ...test_data]);
        //     setLoaded(true);
        //_____
    }

    async function submitReceipt(inputs: ItemInput[]) {
        if (seller == "") {
            setSubmitStatus(1);
            return;
        }
        setSubmitStatus(0);

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
                category: curr.category,
                contributes: newItemContributes[i],
            });
        }

        const data2 = {
            user: username,
            seller: seller,
            receiptID: receiptID,
            items: newItemInputs,
        };
        try {
            const response = await fetch("http://localhost:3001/AddReceipt", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify(data2),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            setBillSplit([...billSplit, ...json.billsplit]);
            setOverspend([...overspend, ...json.overspend]);
            console.log(json.billsplit);
            console.log(json.overspend);
            setDisplayStatus(1);
            // find total cost to users here
        } catch (error) {
            console.error((error as Error).message);
        }

        // TEST
        // const json = {
        //     billsplit: [{ user: "test", amount: 10 }],
        //     overspend: [
        //         { category: "test1", budget: 10, spent: 13 },
        //         { category: "test2", budget: 12, spent: 11 },
        //     ],
        // };
        // setBillSplit([...billSplit, ...json.billsplit]);
        // setOverspend([...overspend, ...json.overspend]);
        // setDisplayStatus(1);
        // -------
    }

    useEffect(() => {
        loadReceipt();
        getCategories();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    if (username == "") {
        //To stop people from bypassing login
        return <Navigate to="/" />;
    }

    return (
        <div className="container">
            <h1 className="container">
                <div className="general-outline">
                    Receipt
                    {receiptID == -1 && (
                        <Link to="/">
                            <button className="input-button">
                                {" "}
                                Return to Home
                            </button>
                        </Link>
                    )}
                    {receiptID != -1 && (
                        <Link to="/ViewReceipt">
                            <button
                                className="input-button"
                                onClick={() => {
                                    setReceiptID(-1);
                                }}
                            >
                                {" "}
                                Return to Receipt History
                            </button>
                        </Link>
                    )}
                </div>
            </h1>
            {displayStatus == 0 && (
                <div>
                    <div className="container2" style={{ margin: 30 }}>
                        <text className="general"> Seller: </text>
                        <input
                            value={seller}
                            className="general-outline"
                            onChange={(event) => {
                                setSeller(event.target.value);
                            }}
                        ></input>
                        {submitStatus == 1 && (
                            <text
                                className="general-outline"
                                style={{ background: "pink" }}
                            >
                                {" "}
                                No seller!{" "}
                            </text>
                        )}
                    </div>
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
                        {!loaded && <text> Loading... </text>}
                        {loaded && (
                            <Itembox
                                inputs={inputs}
                                setInputs={setInputs}
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
                        )}
                    </div>
                </div>
            )}
            {displayStatus == 1 && (
                <div className="container">
                    <text className="general"> Bill Split: </text>

                    <div className="container2">
                        <input className="general" value={"User"} readOnly />
                        <input className="general" value={"Amount"} readOnly />
                    </div>
                    {billSplit.map((user, index) => (
                        <div className="container2">
                            <input className="general-outline" value={user.Username} readOnly />
                            <input className="general-outline" value={user.Spent} readOnly />
                        </div>
                    ))}

                    {overspend.length != 0 && (
                        <div className="container" style={{margin: 20, background: "pink"}}>
                            <text className="general">
                                {" "}
                                Overspent catagories:{" "}
                            </text>
                            <div className="container2">
                                <input
                                    className="general"
                                    value={"Name"}
                                    style={{background: "pink"}}
                                    readOnly
                                />
                                <input
                                    className="general"
                                    value={"Budget"}
                                    style={{background: "pink"}}
                                    readOnly
                                />
                                <input
                                    className="general"
                                    value={"Spent"}
                                    style={{background: "pink"}}
                                    readOnly
                                />
                            </div>
                            {overspend.map((cata, index) => (
                                <div className="container2">
                                    <input
                                        className="general-outline"
                                        value={cata.Category}
                                        readOnly
                                    />
                                    <input
                                        className="general-outline"
                                        value={cata.Budget}
                                        readOnly
                                    />
                                    <input
                                        className="general-outline"
                                        value={cata.Spent}
                                        readOnly
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddReceipt;
