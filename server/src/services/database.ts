import { Receipts } from '../models/Receipts';
import { Items } from '../models/Items';
import pool from './connections';
import { RowDataPacket } from "mysql2";

const thisUserID = 1;

export async function getAllReceipts(): Promise<Receipts[]> {
    const[rows] = await pool.query('Select * From Receipts Where UserID = thisUserID;');
    return rows as Receipts[];
}


