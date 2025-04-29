import express, { Request, Response } from "express";
import bodyParser, { json } from "body-parser";
import "./src/services/database";
import {
    addAccount,
    addBudget,
    addContributes,
    addIncome,
    addItem,
    addReceipt,
    billSplit,
    changeCategoryName,
    findOverspending,
    getAllBudgets,
    getAllReceipts,
    getBudget,
    getItemContributes,
    getReceipt,
    getReceiptItems,
    getUsername,
    goodSpendingHabit,
    login,
    updateBudget,
    verifyAccount,
} from "./src/services/database";
import { Budget, Contributes, Items, Receipts } from "./src/models/models";
import pool from "./src/services/connections";
import { Verify } from "node:crypto";
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


//RECEIPTS
/*
req = 
{
    user: string,
    seller: string,
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

app.post("/CheckUser", (req, res) => {
    verifyAccount(req.body["username"]).then((value) => {
        res.send(value);
    })
})

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
        Seller: req.body["seller"],
    };

    let new_receipt_id = await addReceipt(new_receipt);

    for (let i = 0; i < req.body["items"].length; i++) {
        let x = req.body["items"][i];

        let new_item: Items = {
            ItemID: 0,
            ItemName: x["name"],
            Category: x["category"],
            ReceiptID: new_receipt_id,
            Price: x["price"],
        };

        for (let j = 0; j < x["amount"]; j++) {
            let new_item_id = await addItem(new_item);

            // console.log(new_item_id);
            let new_percent = 1 / x["contributes"].length;

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

    return new_receipt_id;
}


/*
{
    billsplit: [
        {
            Username: string,
            Spent: number
        }
    ],

    overspend: [
        {
            Category: string,
            Spent: number,
            Budget: number
        }
    ]
}
*/

async function getResults(req: any)
 {
    let receipt_id = await addAll(req);
    let uid = await verifyAccount(req.body["user"]);
    let split = await billSplit(receipt_id);
    let over = await findOverspending(uid);

    let new_split = [];
    let new_over = [];

    for (let i = 0; i < split.length; i++) {
        let s = split[i];
        new_split.push({Username: await getUsername(s.UserId), Spent: s.Paid});
    }

    for (let i = 0; i < over.length; i++) {
        let s = over[i];
        new_over.push({Category: s.Category, Spent: s.TotalSpentInCategory, Budget: s.Budget});
    }

    console.log(new_split);
    console.log(new_over);

    return JSON.stringify({billsplit: new_split, overspend: new_over});
 }
app.put("/addReceipt", (req: Request, res: Response) => {
    getResults(req).then((val) => res.send(val));
});

async function obtainReceipt(receiptID: number) {
    if (receiptID == -1) {
        // console.log("man wtf");
        return;
    }
    let new_receipt: Receipts = await getReceipt(receiptID);
    let items: Items[] = await getReceiptItems(receiptID);

    console.log(new_receipt);
    // console.log(items);

    let item_map = new Map();

    for (let i = 0; i < items.length; i++) {
        let k = items[i];

        if (item_map.has(k.ItemName)) {
            let l = item_map.get(k.ItemName);
            l["amount"] += 1;
            item_map.set(k.ItemName, l);
        } else {
            item_map.set(k.ItemName, {
                id: k.ItemID,
                name: k.ItemName,
                price: k.Price,
                amount: 1,
                category: k.Category,
                contributes : [""]
            })
        }
    }

    // console.log(item_map);

    let all_inputs: any = [];
    let item_arr = Array.from(item_map.entries());

    for(let i = 0; i < item_arr.length; i++) {
        let item_input = item_arr[i][1];
        let c : Contributes[] = await getItemContributes(item_input["id"]);
        let names = [];

        for (let i = 0; i < c.length; i++) {
            names.push(await getUsername(c[i]["UserID"]));
        }

        item_input["contributes"] = names;

        // console.log(item_input);
        all_inputs.push(item_input);
        // console.log(all_inputs.length);
    }

    // console.log(all_inputs.length);

    let data = {
        user: new_receipt.UserID,
        seller: new_receipt.Seller,
        items: all_inputs
    }

    return data;
}

app.post("/GetReceipt", (req: Request, res: Response) => {
    // console.log("hello");
    obtainReceipt(req.body["receipt"]).then((data) => {
        // console.log(data);
        res.send(data);
    })
});

app.post("/ViewReceipt", (req: Request, res: Response) => {
    verifyAccount(req.body["user"]).then((uid) => {
        getAllReceipts(uid).then((receipts: Receipts[]) => {
            let new_receipts = []

            for (let i = 0; i < receipts.length; i++) {
                let r : Receipts = receipts[i];
                let date = r.PurchaseDate.toString();
                let idx = date.search(":");
                new_receipts.push({ReceiptID: r.ReceiptID, PurchaseDate: r.PurchaseDate.toString().substring(0,idx - 3), Seller: r.Seller});
            }
            res.send(JSON.stringify(new_receipts));
        });
    });
});

//CATEGORIES
/*
{
    user: username
}
*/
app.post("/ViewCategory", (req: Request, res: Response) => {
    verifyAccount(req.body["user"]).then((uid: number) => { 
        getAllBudgets(uid).then((budgets: Budget[]) => {
            let data = [];

            for (let i = 0; i < budgets.length; i++) {
                let b = budgets[i];
                data.push({Category: b["Category"], Budget: b["Budget"], Spent: b["Spent"]});
            }

            res.send(data);
        });
    })
});

app.post("/goodSpendingHabit", (req, res) => {
    verifyAccount(req.body["username"]).then((uid) => {
        goodSpendingHabit(uid).then((val) => {
            res.send(val);
        })
    })
})

app.put("/addIncome", (req,res) => {
    addIncome(req.body["Username"], req.body["Income"]).then(() => res.send("accepted"));
})
/*
{
    user: username,
    new: [
        {
            category: string
            budget: number
            spent: number
        },
        old_name
    ]
}
*/
app.put("/updateBudget", (req: Request, res: Response) => {
    verifyAccount(req.body["user"]).then((uid) => {
        let data = req.body["new"];

        for (let i = 0; i < data.length; i++) {
            let b = data[i];
            let c = b[0];
            let old = b[1];

            let new_budget: Budget = {
                Category: c["category"],
                UserID: uid,
                Budget: c["budget"],
                Spent: c["spent"]
            }
            if (old == "") {
                addBudget(new_budget);
            } else {
                changeCategoryName(c["category"], uid, old).then(() => {
                    c["UserID"] = uid;
                    updateBudget(new_budget);
                });
            }
        }

        res.send("Updated Budget");
    });
});


app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});

let req = {
    user: "david",
    seller: "",
    items: [{
                name: "jake",
                price: 10,
                amount: 1,
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

// fetch("http://localhost:3001/AddReceipt", {
//     headers: { "Content-type": "application/json" },
//     method: "PUT",
//     body: JSON.stringify(req),
// }).then(() => console.log("wtf"));
