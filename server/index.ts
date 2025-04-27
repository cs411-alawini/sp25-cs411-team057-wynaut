import express, { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import "./src/services/database";
import {
    addAccount,
    addContributes,
    addItem,
    addReceipt,
    login,
    verifyAccount,
} from "./src/services/database";
import { Contributes, Items, Receipts } from "./src/models/models";
import pool from "./src/services/connections";
const date = require("date");
const cors = require("cors");

//SET UP
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());


//LOGIN
app.post("/login", (req, res) => {
    login(req.body["username"], req.body["password"]).then(function (value) {
        res.send(value);
    }).catch(() => {res.send(-1);});
});

app.put("/login", (req, res) => {
    addAccount(req.body["username"], req.body["password"]).then(function (value) {
        if (value == 1) {
            res.send("account created");
        } else {
            res.send("account already exists");
        }
    }).catch(() => {res.send("failed to create account");});
});

/*
req = 
{
    user: string,
    items:  [
                {
                name: string,
                price: num,
                amount: num,
                category: string,
                contributes: [string]
                }
            ]
}

Example (Getting the first items name): req["items"][0]["name"]
*/

async function check_users(req: any): Promise<string> {
    for (let i = 0; i < req.body["items"].length; i++) {
        let x = req.body["items"][i];
        let contributes = x["contributes"];

        for (let j = 0; j < contributes.length; j++) {
            if (await verifyAccount(contributes[j]) < 1) {
                return contributes[j];
            }
        }
    }

    return '';
}

async function addAll(req: Request) {
    let currentdate = new Date();
    let datetime =
        currentdate.getFullYear() +
        "-" +
        (currentdate.getMonth() + 1) +
        "-" +
        currentdate.getDate();

    let new_receipt: Receipts = {
        ReceiptID: 0,
        UserID: await verifyAccount(req.body["user"]),
        PurchaseDate: datetime,
        Seller: "none",
    };

    let new_receipt_id = await addReceipt(new_receipt);

    console.log(new_receipt_id);

    for (let i = 0; i < req.body["items"].length; i++) {
        let x = req.body["items"][i];

        let new_item: Items = {
            ItemId: 0,
            ItemName: x["name"],
            Category: null,
            ReceiptID: new_receipt_id,
            Price: x["price"],
        };

        for (let j = 0; j < x["amount"]; j++) {
            let new_item_id = await addItem(new_item);

            console.log(new_item_id);
            let new_percent = 100 / x["contributes"].length;

            for (let k = 0; k < x["contributes"].length; k++) {

                let new_contribute: Contributes = {
                    UserID: await verifyAccount(x["contributes"][k]),
                    ItemID: new_item_id,
                    Percentage: new_percent
                }

                addContributes(new_contribute);
            }
        }
    }

}

app.put("/addReceipt", (req: Request, res: Response) => {
    // console.log(req.body["items"][0]);
    check_users(req).then((value) => {
        if (value == '') {
            addAll(req);
            res.send("added receipt");
        } else {
            res.send("invalid users");
        }

    }).catch(() => res.send("failed to add receipt"));
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});

/*
req = 
{
    user: string,
    items:  [
                {
                name: string,
                price: num,
                amount: num,
                category: string,
                contributes: [string]
                }
            ]
}

Example (Getting the first items name): req["items"][0]["name"]
*/

let req = {
    user: 1001,
    items: [{
                name: "jake",
                price: 10,
                amount: 2,
                category: "people",
                contributes: ["CJ", "Kevin", "Wenhao", "David"]
            }
            ,
            {
                name: "jake2",
                price: 5,
                amount: 1,
                category: "people",
                contributes: ["CJ", "David"]
            },]
}

// fetch("http://localhost:3001/addReceipt", {
//     headers: { "Content-type": "application/json" },
//     method: "PUT",
//     body: JSON.stringify(req),
// }).then(() => console.log("wtf"));