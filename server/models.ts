export interface Accounts{
    userID: number,
    username: string,
    password: string,
    income: number,
    minIncome: number,
    maxIncome: number
}

export interface Receipts {
    receiptID: number,
    userID: number,	
    purchaseDate: number, 
    seller: string
}


export interface Items {
    itemID: number,
    category: string,
    receiptID: number,
    itemName: string,
    price: number
}


export interface AverageExpense {
    minIncome: number,
    maxIncome: number,
    avgExpense: number
}

export interface Budget {
    Category: string, 
    UserID: number,
    Budget: number, 
    Spent: number
}

export interface Contributes {
    UserID: number, 
    ItemID: number, 
    Percentage: number
}