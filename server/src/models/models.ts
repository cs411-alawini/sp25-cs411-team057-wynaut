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
    Category: String,
    UserID: Number,
    Budget: Float32Array,
    Spent: Float32Array,
}
export interface Contributes {
    UserID: Number,
    ItemID: Number,
    Percentage: Float32Array,
}
export interface Items {
    ItemId: Number,
    Category: String,
    ReceiptID: Number,
    ItemName: String,
    Price: Float32Array
}
export interface Receipts {
    ReceiptID: Number,
    UserID: Number,
    PurchaseDat: Date,
    Seller: String
}