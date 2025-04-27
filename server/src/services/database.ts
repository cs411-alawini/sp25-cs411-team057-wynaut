import { Receipts, Items, Accounts } from "../models/models";
import pool from "./connections";
import { RowDataPacket } from "mysql2";

export async function getAllReceipts(userID: number): Promise<Receipts[]> {
    const sqlQuery = `Select * From Receipts Where UserID = ${userID};`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Receipts[];
}
export async function addAccount(
    Username: string,
    Password: string
): Promise<number> {
    try {
        const sqlQuery = `Insert Into Accounts(Username, Password, Income, MinIncome, MaxIncome) 
                        VALUES ('${Username}', '${Password}', null, null, null)`;
        await pool.query(sqlQuery);
        return 1;
    } catch (err) {
        console.error((err as Error).message);
        return -1;
    }
}

export async function verifyAccount(
    Username: string,
): Promise<number> {
    const sqlQuery = `Select UserID From Accounts Where Username = '${Username}'`;
    const [rows] = await pool.query(sqlQuery);
    const User = rows as [{ UserID: number }];
    if ((User.length as number) == 0) return 0;
    else return User[0].UserID;
}

export async function login(
    Username: string,
    Password: string
): Promise<number> {
    const sqlQuery = `Select UserID From Accounts Where Username = '${Username}' and Password = '${Password}'`;
    const [rows] = await pool.query(sqlQuery);
    const User = rows as [{ UserID: number }];
    if ((User.length as number) == 0) return 0;
    else return User[0].UserID;
}

export async function addReceipt(
    receipt: Omit<Receipts, "ReceiptID">
): Promise<number> {
    const sqlQuery = `Insert Into Receipts(UserID, PurchaseDate, Seller) VALUES (${receipt.UserID}, '${receipt.PurchaseDate}', '${receipt.Seller}');`;
    await pool.query(sqlQuery);
    const [maxNum] = await pool.query(
        "Select Max(ReceiptID) as maxNum From Receipts"
    );
    return (maxNum as [{ maxNum: number }])[0].maxNum;
}

export async function addItem(item: Omit<Items, "ItemId">): Promise<void> {
    let sqlQuery = `Insert Into Items(Category, ReceiptID, ItemName, Price) VALUES ('${item.Category}', ${item.ReceiptID}, '${item.ItemName}', ${item.Price});`;

    if (item.Category == null) {
        sqlQuery = `Insert Into Items(Category, ReceiptID, ItemName, Price) VALUES (${item.Category}, ${item.ReceiptID}, '${item.ItemName}', ${item.Price});`;

    }
    
    await pool.query(sqlQuery);
}

export async function deleteReceipt(receiptID: number): Promise<void> {
    const sqlQuery = `Delete From Receipts Where ReceiptID = ${receiptID};`;
    await pool.query(sqlQuery);
    return;
}

export async function deleteItem(itemID: number): Promise<void> {
    const sqlQuery = `Delete From Items Where ItemID = ${itemID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateReceipt(receipt: Receipts): Promise<void> {
    const sqlQuery = `Update Receipts Set UserID = ${receipt.UserID}, PurchaseDate = '${receipt.PurchaseDate}', Seller = '${receipt.Seller}' Where ReceiptID = ${receipt.ReceiptID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateItem(item: Items): Promise<void> {
    const sqlQuery = `Update Items Set Category = '${item.Category}', ItemName = '${item.ItemName}', Price = ${item.Price} Where ItemID = ${item.ItemId};`;
    await pool.query(sqlQuery);
    return;
}

export async function getReceipt(receiptID: number): Promise<Receipts> {
    const sqlQuery = `Select * From Receipts Where ReceiptID = ${receiptID};`;
    const [rows] = await pool.query(sqlQuery);
    return (rows as Receipts[])[0];
}

export async function getItem(itemID: number): Promise<Items> {
    const sqlQuery = `Select * From Items Where ItemID = ${itemID};`;
    const [rows] = await pool.query(sqlQuery);
    return (rows as Items[])[0];
}

// Testing
async function main() {
    // await addReceipt({
    //     UserID: 1,
    //     PurchaseDate: "2025-04-09",
    //     Seller: "TestSell",
    // });
    // await addItem({
    //     Category: "Education",
    //     ReceiptID: 1,
    //     ItemName: "TestItem",
    //     Price: 1.01,
    // });
    // getReceipt(1000).then((results) => {
    //     console.log(results);
    // });
    // getItem(9901).then((results) => {
    //     console.log(results);
    // });
    // await updateReceipt({
    //     ReceiptID: 1000,
    //     UserID: 1,
    //     PurchaseDate: "2025-04-09",
    //     Seller: "TestSell2",
    // });
    // await updateItem({
    //     ItemId: 9901,
    //     Category: "Education",
    //     ReceiptID: 1,
    //     ItemName: "TestItem2",
    //     Price: 1.01,
    // });
    // getReceipt(1000).then((results) => {
    //     console.log(results);
    // });
    // getItem(9901).then((results) => {
    //     console.log(results);
    // });
    // deleteReceipt(1000);
    // deleteItem(9901);
    // login({Username: "TestUser", Password: "12"}).then((results) => {
    //     console.log(results);
    // });
}

main();
