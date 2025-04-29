import React, { JSX, useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import { UserReceiptState, Receipt } from "../components/interfaces";

const ViewReceipt = ({
    username,
    setUsername,
    receiptID,
    setReceiptID,
}: UserReceiptState): JSX.Element => {
    const [oldReceipts, setOldReceipts] = useState<Array<Receipt>>([]);
    const [loaded, setLoaded] = useState(false); //loading of initial page (fetch receipts)
    const [status, setStatus] = useState(0); //0 = viewing all receipt; 1 = viewing single receipt

    async function getOldReceipt() {
        try {
            const response = await fetch("http://localhost:3001/ViewReceipt", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "Post",
                body: JSON.stringify({ user: username }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json: Array<Receipt> = await response.json();
            let curr_Receipts = [...oldReceipts];
            curr_Receipts.splice(0);
            setOldReceipts([...curr_Receipts, ...json]);
            setLoaded(true);
        } catch (error) {
            console.error((error as Error).message);
        }

        // let test_data: Array<Receipt> = [
        //     { ReceiptID: 1, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        //     { ReceiptID: 2, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        //     { ReceiptID: 3, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        //     { ReceiptID: 4, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        //     { ReceiptID: 5, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        //     { ReceiptID: 6, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        //     { ReceiptID: 7, UserID: 1, PurchaseDate: "Date", Seller: "Seller" },
        // ];
        // let curr_Receipts = [...oldReceipts];
        // curr_Receipts.splice(0);
        // setOldReceipts([...curr_Receipts, ...test_data]);
        // setLoaded(true);
    }

    async function deleteReceipt(curr_receiptID : number) {
        try {
            const response = await fetch("http://localhost:3001/deleteReceipt", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify({ receiptID: curr_receiptID }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            getOldReceipt();

        } catch (error) {
            console.error((error as Error).message);
        }
    }

    useEffect(() => {
        getOldReceipt();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    if (username == "") {
        //To stop people from bypassing login
        return <Navigate to="/" />;
    }
    return (
        <div>
            <h1 className="container">
                <div className="general-outline">
                    Receipt View
                    <Link to="/">
                        <button className="input-button">Return to Home</button>
                    </Link>
                </div>

                {!loaded && <text> Loading... </text>}
                {loaded && status == 0 && (
                    <div className="container">
                        <div className="input-container">
                            <input
                                className="general"
                                value={"ReceiptID"}
                                readOnly
                            ></input>
                            <input
                                className="general"
                                value={"PurchaseDate"}
                                readOnly
                            ></input>
                            <input
                                className="general"
                                value={"Seller"}
                                readOnly
                            ></input>
                        </div>
                        {oldReceipts.map((receipt, index) => (
                            <div className="input-container">
                                <input
                                    className="general-outline"
                                    value={receipt.ReceiptID}
                                    readOnly
                                ></input>
                                <input
                                    className="general-outline"
                                    value={receipt.PurchaseDate}
                                    readOnly
                                ></input>
                                <input
                                    className="general-outline"
                                    value={receipt.Seller}
                                    readOnly
                                ></input>
                                <Link to="/AddReceipt">
                                    <button
                                        className="input-button"
                                        onClick={() => {
                                            setReceiptID(receipt.ReceiptID);
                                        }}
                                    >   
                                        View
                                    </button>
                                </Link>
                                <button
                                        className="input-button"
                                        onClick={() => {
                                            deleteReceipt(receipt.ReceiptID);
                                        }}
                                    >   
                                        Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </h1>
        </div>
    );
};

export default ViewReceipt;
