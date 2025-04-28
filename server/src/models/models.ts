export interface Accounts {
    UserID: number;
    Username: string;
    Password: string;
    Income: number | null;
    MinIncome: number | null;
    MaxIncome: number | null;
}
export interface AverageExpense {
    MinIncome: number;
    MaxIncome: number;
    AvgExpense: number;
}
export interface Budget {
    Category: string;
    UserID: number;
    Budget: number | null;
    Spent: number;
}
export interface Contributes {
    UserID: number;
    ItemID: number;
    Percentage: number;
}
export interface Items {
    ItemID: number;
    Category: string | null;
    ReceiptID: number;
    ItemName: string;
    Price: number;
}
export interface Receipts {
    ReceiptID: number;
    UserID: number;
    PurchaseDate: string;
    Seller: string;
}

export interface Test {
    UserID: number;
    Username: string;
    Password: string;
}
