import { Receipts } from '../models/models';
import { Items } from '../models/models';
import pool from './connections';
import { RowDataPacket } from "mysql2";

const thisUserID = 1;

export async function getAllReceipts(): Promise<Receipts[]> {
    const[rows] = await pool.query('Select * From Receipts Where UserID = thisUserID;');
    return rows as Receipts[];
}

console.log(getAllReceipts());
