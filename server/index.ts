import express, { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import "./src/services/database";
import {
    addAccount,
    addItem,
    addReceipt,
    login,
} from "./src/services/database";
import { Items, Receipts } from "./src/models/models";
import pool from "./src/services/connections";
const date = require("date");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/login", (req, res) => {
    // console.log(req.body);
    login(req.body["username"], req.body["password"]).then(function (value) {
        // console.log(`id: ${value} \n`);
        res.send(value);
    }).catch((err) => {res.send(-1);});
});

app.put("/login", (req, res) => {
    // console.log(req.body);
    addAccount(req.body["username"], req.body["password"]).then(function (value) {
        if (value == 1) {
            res.send(1);
        } else {
            res.send(0);
        }
    }).catch((err) => {res.send(-1);});
});

app.put("/addReceipt", (req: Request, res: Response) => {
    let currentdate = new Date();
    let datetime =
        currentdate.getFullYear() +
        "-" +
        (currentdate.getMonth() + 1) +
        "-" +
        currentdate.getDate();

    let new_receipt: Receipts = {
        ReceiptID: 0,
        UserID: req.body[1],
        PurchaseDate: datetime,
        Seller: "none",
    };

    addReceipt(new_receipt).then(function (new_receipt_id) {
        for (let i = 0; i < req.body[0].length; i++) {
            let x = req.body[0][i];

            console.log(x);

            let new_item: Items = {
                ItemId: 0,
                ItemName: x["name"],
                Category: null,
                ReceiptID: new_receipt_id,
                Price: x["price"],
            };

            for (let j = 0; j < x["amount"]; j++) {
                addItem(new_item);
            }
        }

        res.send(1);

        console.log(new_receipt_id);
    }).catch((err) => res.send(-1));
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
