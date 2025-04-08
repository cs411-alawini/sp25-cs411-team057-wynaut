import { Receipts, Items, Test } from '../models/Models';
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
    const sqlQuery = `Insert Into Receipts(ReceiptID, UserID, PurchaseDate, Seller) VALUES (${nextNum}, ${receipt.UserID}, '${receipt.PurchaseDate}', '${receipt.Seller}')`;
    await pool.query(sqlQuery);
}

export async function addItem(item: Omit<Items, 'ItemId'>): Promise<void>{
    const [maxNum] = await pool.query('Select Max(ItemID) as maxNum From Items');
    const nextNum = ((maxNum as [{maxNum:number}])[0].maxNum) + 1;
    const sqlQuery = `Insert Into Items(ItemID, Category, ReceiptID, ItemName, Price) VALUES (${nextNum}, '${item.Category}', ${item.ReceiptID}, '${item.ItemName}', ${item.Price})`;
    await pool.query(sqlQuery);
}

addItem({Category:'Education', ReceiptID:999, ItemName:'TestName', Price:12.01});