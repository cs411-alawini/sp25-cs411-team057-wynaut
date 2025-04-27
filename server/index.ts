import express, { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import "./src/services/database";
import {
    addAccount,
    addItem,
    addReceipt,
    login,
    verifyAccount,
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
            res.send("account created");
        } else {
            res.send("account already exists");
        }
    }).catch((err) => {res.send("failed to create account");});
});

function check_percentage(contributes: Array<[number,number]>) {
    let total_percentage = 0;
    for (let i = 0; i < contributes.length; i++) {
        let x = contributes[i];
        total_percentage += x[1];
    }

    if (total_percentage == 100) {
        return true;
    }

    return false;
}

async function check_users(req: any): Promise<string> {
    for (let i = 0; i < req.body.length; i++) {
        let x = req.body[i];
        let contributes = x["contributes"];

        
        for (let j = 0; j < contributes.length; j++) {
            if (await verifyAccount(contributes[j][0]) < 1) {
                return contributes[j][0];
            }
        }
    }

    return '';
}
/*
req = 
{
    [
        {
        name: string (ItemName)
        price: num (Price)
        amount: num (Quantity)
        category: string 
        contributes: Array<(num,num)>[] (Username, Contributes) first Username should be the owner of the receipt
        }
    ]
}
*/
app.put("/addReceipt", (req: Request, res: Response) => {
    for (let i = 0; i < req.body.length; i++) {
        if (!check_percentage(req.body[0]["contributes"])) {
            res.send("percentages don't add up to 100");
            return;
        }
    }

    let validUsers = '';
    check_users(req).then((value) => {
        validUsers = value;
        
        if (validUsers == '') {
            res.send("invalid Users");
            return;
        }

        let currentdate = new Date();
        let datetime =
            currentdate.getFullYear() +
            "-" +
            (currentdate.getMonth() + 1) +
            "-" +
            currentdate.getDate();

        let new_receipt: Receipts = {
            ReceiptID: 0,
            UserID: req.body[0]["contributes"][0],
            PurchaseDate: datetime,
            Seller: "none",
        };

        addReceipt(new_receipt).then(function (new_receipt_id) {
            for (let i = 0; i < req.body[0].length; i++) {
                let x = req.body[i];

                console.log(x);

                let new_item: Items = {
                    ItemId: 0,
                    ItemName: x["name"],
                    Category: x["category"],
                    ReceiptID: new_receipt_id,
                    Price: x["price"],
                };

                for (let j = 0; j < x["amount"]; j++) {
                    addItem(new_item);
                }
            }

            res.send("added receipt");

            console.log(new_receipt_id);
        }).catch((err) => res.send("failed to add receipt"));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
