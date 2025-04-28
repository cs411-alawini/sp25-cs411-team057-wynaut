import { Receipts, Items, Accounts, Contributes, Budget } from "../models/models";
import pool from "./connections";
import { RowDataPacket } from "mysql2";

export async function getAllReceipts(userID: number): Promise<Receipts[]> {
    const sqlQuery = `Select * From Receipts Where UserID = ${userID} LIMIT 10;`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Receipts[];
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

export async function getUsername(
    UserID: number,
): Promise<string> {
    const sqlQuery = `Select Username From Accounts Where UserID = '${UserID}'`;
    const [rows] = await pool.query(sqlQuery);
    const User = rows as [{ Username: string }];
    if ((User.length as number) == 0) return '';
    else return User[0].Username;
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

export async function addItem(item: Omit<Items, "ItemId">): Promise<number> {
    let sqlQuery = `Insert Into Items(Category, ReceiptID, ItemName, Price) VALUES ('${item.Category}', ${item.ReceiptID}, '${item.ItemName}', ${item.Price});`;

    if (item.Category == null) {
        sqlQuery = `Insert Into Items(Category, ReceiptID, ItemName, Price) VALUES (${item.Category}, ${item.ReceiptID}, '${item.ItemName}', ${item.Price});`;
    }

    await pool.query(sqlQuery);
    const [maxNum] = await pool.query(
        "Select Max(ItemID) as maxNum From Items"
    );

    return (maxNum as [{ maxNum: number }])[0].maxNum;
}

export async function addBudget(budget: Budget): Promise<void>{
    const sqlQuery = `Insert Into Budget(Category, UserID, Budget, Spent) VALUES ('${budget.Category}', ${budget.UserID}, ${budget.Budget}, ${budget.Spent});`;
    await pool.query(sqlQuery);
}

export async function addContributes(contributes: Contributes): Promise<void>{
    const sqlQuery = `Insert Into Contributes(UserID, ItemID, Percentage) VALUES (${contributes.UserID}, ${contributes.ItemID}, ${contributes.Percentage});`;
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

export async function deleteBudget(category: string, userId: number): Promise<void> {
    const sqlQuery = `Delete From Budget Where Category = '${category}' and UserID = ${userId};`;
    await pool.query(sqlQuery);
    return;
}

export async function deleteContributes(userID: number, itemID: number): Promise<void> {
    const sqlQuery = `Delete From Contributes Where UserID = ${userID} and ItemID = ${itemID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateReceipt(receipt: Receipts): Promise<void> {
    const sqlQuery = `Update Receipts Set UserID = ${receipt.UserID}, PurchaseDate = '${receipt.PurchaseDate}', Seller = '${receipt.Seller}' Where ReceiptID = ${receipt.ReceiptID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateItem(item: Items): Promise<void> {
    const sqlQuery = `Update Items Set Category = '${item.Category}', ItemName = '${item.ItemName}', Price = ${item.Price} Where ItemID = ${item.ItemID};`;
    await pool.query(sqlQuery);
    return;
}

export async function updateBudget(budget: Omit<Budget, "Spent">): Promise<void> {
    const sqlQuery = `Update Budget Set Budget = ${budget.Budget} Where UserID = ${budget.UserID} and Category = '${budget.Category}';`;
    await pool.query(sqlQuery);
    return;
}

export async function changeCategoryName(category:string, userID:number, newName:string): Promise<void>{
    const sqlQuery = `Update Budget Set Category = '${newName}' Where Category = '${category}' and UserID = ${userID};`;
    await pool.query(sqlQuery);
    return;
}
export async function updateContributes(contribute: Contributes): Promise<void>  {
    const sqlQuery = `Update Contributes Set Percentage = ${contribute.Percentage} Where UserID = ${contribute.UserID} and ItemID = ${contribute.ItemID};`;
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

export async function getReceiptItems(receiptID: number): Promise<Items[]> {
    const sqlQuery = `Select * From Items Where ReceiptID = ${receiptID};`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Items[];
}

export async function getAllBudgets(userID:number): Promise<Budget[]>{
    const sqlQuery = `Select * From Budget Where UserID = ${userID};`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Budget[];
}

export async function getBudget(category: string, userID:number): Promise<Budget[]>{
    const sqlQuery = `Select * From Budget Where UserID = ${userID} and Category = '${category}';`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Budget[];
}

export async function getContributes(userID:number, itemID:number): Promise<Contributes>{
    const sqlQuery = `Select * From Contributes Where UserID = ${userID} and ItemID = ${itemID};`;
    const [rows] = await pool.query(sqlQuery);
    return (rows as Contributes[])[0];
}

export async function getItemContributes(itemID:number): Promise<Contributes[]>{
    const sqlQuery = `Select * From Contributes Where ItemID = ${itemID};`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Contributes[];
}

export async function billSplit(receiptID: number): Promise<{UserId: number, Paid: number}>{
    const sqlQuery = `Call billSplit(${receiptID});`;
    const [rows] = await pool.query(sqlQuery);
    return (rows as [{UserId: number, Paid: number}])[0];
}

export async function updateUserSpending(userID: number): Promise<void>{
    const sqlQuery = `Call UpdateUserSpending(${userID});`;
    pool.query(sqlQuery);
}

// Testing
async function main() {
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
    // billSplit(1021).then((results) =>{
    //     console.log(results);
    // });
    // updateUserSpending(1000);
    // await addContributes({UserID: 1000,
    //     ItemID: 9408,
    //     Percentage: 0.01});
    // await addBudget({Category: "TestCat2",
    //     UserID: 1000,
    //     Budget: null,
    //     Spent: 0});
    // getBudget("TestCat2", 1000).then((results) =>{
    //     console.log(results);
    // });
    // getContributes(1000, 9408).then((results) =>{
    //     console.log(results);
    // });
    // await updateBudget({Category: "TestCat2", UserID: 1000, Budget: 5000});
    // getBudget("TestCat2", 1000).then((results) =>{
    //     console.log(results);
    // });
    // await changeCategoryName("TestCat2", 1000, "TestCat3");
    // getBudget("TestCat3", 1000).then((results) =>{
    //     console.log(results);
    // });
    // await updateContributes({UserID: 1000, ItemID: 9408, Percentage: 0.02});
    // getContributes(1000, 9408).then((results) =>{
    //     console.log(results);
    // });
    // await deleteBudget("TestCat3",1000);
    // getBudget("TestCat3", 1000).then((results) =>{
    //     console.log(results);
    // });
    // await deleteContributes(1000,9408);
    // getContributes(1000, 9408).then((results) =>{
    //     console.log(results);
    // });

    // await getReceiptItems(5).then((results) => {
    //     console.log(results);
    // });
}

main();
