import { Receipts, Items, Test } from '../models/models';
import pool from './connections';
import { RowDataPacket } from "mysql2";

export async function getAllReceipts(userID: number): Promise<Receipts[]> {
    const sqlQuery = `Select * From Receipts Where UserID = ${userID};`;
    const[rows] = await pool.query(sqlQuery);
    return rows as Receipts[];
}

export async function addReceipt(receipt: Omit<Receipts, 'ReceiptID'>): Promise<void>{
    const [maxNum] = await pool.query('Select Max(ReceiptID) as maxNum From Receipts');
    const nextNum = ((maxNum as [{maxNum:number}])[0].maxNum) + 1;
    const sqlQuery = `Insert Into Receipts(ReceiptID, UserID, PurchaseDate, Seller) VALUES (${nextNum}, ${receipt.UserID}, '${receipt.PurchaseDate}', '${receipt.Seller}');`;
    await pool.query(sqlQuery);
    return;
}

export async function addItem(item: Omit<Items, 'ItemId'>): Promise<void>{
    const [maxNum] = await pool.query('Select Max(ItemID) as maxNum From Items');
    const nextNum = ((maxNum as [{maxNum:number}])[0].maxNum) + 1;
    const sqlQuery = `Insert Into Items(ItemID, Category, ReceiptID, ItemName, Price) VALUES (${nextNum}, '${item.Category}', ${item.ReceiptID}, '${item.ItemName}', ${item.Price});`;
    await pool.query(sqlQuery);
    return;
}

export async function deleteReceipt(receiptID: number): Promise<void>{
    const sqlQuery = `Delete From Receipts Where ReceiptID = ${receiptID};`;
    await pool.query(sqlQuery);
    return;
}

export async function deleteItem(itemID: number): Promise<void>{
    const sqlQuery = `Delete From Items Where ItemID = ${itemID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateReceipt(receipt: Receipts): Promise<void>{
    const sqlQuery = `Update Receipts Set UserID = ${receipt.UserID}, PurchaseDate = '${receipt.PurchaseDate}', Seller = '${receipt.Seller}' Where ReceiptID = ${receipt.ReceiptID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateItem(item: Items): Promise<void>{
    const sqlQuery = `Update Items Set Category = '${item.Category}', ItemName = '${item.ItemName}', Price = ${item.Price} Where ItemID = ${item.ItemId};`;
    await pool.query(sqlQuery);
    return;
}

export async function getReceipt(receiptID: number): Promise<Receipts>{
    const sqlQuery = `Select * From Receipts Where ReceiptID = ${receiptID};`;
    const [rows] = await pool.query(sqlQuery);
    return (rows as Receipts[])[0];
}

export async function getItem(itemID: number):Promise<Items>{
    const sqlQuery = `Select * From Items Where ItemID = ${itemID};`;
    const [rows] = await pool.query(sqlQuery);
    return (rows as Items[])[0];
}

// Testing
async function main(){
    await addReceipt({UserID:1, PurchaseDate:"2025-04-09", Seller:"TestSell"});
    await addItem({Category:"Education", ReceiptID:1, ItemName:"TestItem", Price:1.01});
    getReceipt(1000).then((results) =>{
        console.log(results);
    });
    getItem(9901).then((results) => {
        console.log(results);
    });
    await updateReceipt({ReceiptID: 1000, UserID:1, PurchaseDate:"2025-04-09", Seller:"TestSell2"});
    await updateItem({ItemId:9901, Category:"Education", ReceiptID:1, ItemName:"TestItem2", Price:1.01});
    getReceipt(1000).then((results) =>{
        console.log(results);
    });
    getItem(9901).then((results) => {
        console.log(results);
    });
    deleteReceipt(1000);
    deleteItem(9901);
}

//main();
