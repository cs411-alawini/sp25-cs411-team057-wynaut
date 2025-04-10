import express, { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import "./src/services/database";
import { addItem, addReceipt } from "./src/services/database";
import { Items, Receipts } from "./src/models/models";
import pool from "./src/services/connections";
const date = require("date");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get("/api/", (req: Request, res: Response) => {
    res.send("API");
});

app.get("/AddReceipt", (req: Request, res: Response) => {
    res.send("hello");
});

app.put("/AddReceipt", (req: Request, res: Response) => {
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
    addReceipt(new_receipt).then(function (value: number) {
        let new_receipt_id = value;

        function loop(i: number): void {
            if (i >= req.body[0].length) {
                return;
            }

            let x = req.body[0][i];

            let new_item: Items = {
                ItemId: 0,
                ItemName: x["name"],
                Category: null,
                ReceiptID: new_receipt_id,
                Price: x["price"],
            };

            addItem(new_item).then(() => loop(i + 1));
        }

        loop(0);
        res.send("accepted");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
