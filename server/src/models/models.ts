export interface Accounts {
    UserID: number,
    Username: string,
    Password: string,
    Income: Float32Array,
    MinIncome: Float32Array,
    MaxIncome: Float32Array
}
export interface AverageExpense {
    MinIncome: Float32Array,
    MaxIncome: Float32Array,
    AvgExpense: Float32Array
}
export interface Budget {
    Category: string,
    UserID: number,
    Budget: Float32Array,
    Spent: Float32Array,
}
export interface Contributes {
    UserID: number,
    ItemID: number,
    Percentage: Float32Array,
}
export interface Items {
    ItemId: number,
    Category: string,
    ReceiptID: number,
    ItemName: string,
    Price: number
}
export interface Receipts {
    ReceiptID: number,
    UserID: number,
    PurchaseDate: string,
    Seller: string
}

export interface Test{
    UserID: number,
    Username: string,
    Password: string
}