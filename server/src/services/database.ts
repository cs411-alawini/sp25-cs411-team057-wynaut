import { Receipts } from '../models/Receipts';
import { Items } from '../models/Items';
import {receiptsData, itemsData} from '../../../data/mockData';
import pool from './connections';
import { RowDataPacket } from "mysql2";

const thisUserID = 1;
//const receipt: Receipts[] = receiptsData
//const item: Items[] = itemsData

export async function getAllReceipts(): Promise<Receipts[]> {
    const[rows] = await pool.query('Select * From Receipts Where UserID = thisUserID;');
    return rows as Receipts[];
}


