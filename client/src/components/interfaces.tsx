export interface UsernameInput {
    username: string;
}

export interface UserReceiptInput {
    username: string;
    receiptID: number;
}

export interface UserReceiptState{
    username : string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    receiptID: number
    setReceiptID: React.Dispatch<React.SetStateAction<number>>
}

export interface ItemInput {
    name: string;
    price: string;
    amount: number;
    category: string;
}

export interface CategoryInput {
    Category: string;
    Budget: number;
    Spent: number;
}

export interface UserInput {
    userInputs: string[];
    setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
    selected: number;
    setSelect: React.Dispatch<React.SetStateAction<number>>;
    userItems: number[][];
    setUserItems: React.Dispatch<React.SetStateAction<number[][]>>;
    itemsUser: number[];
    setItemsUser: React.Dispatch<React.SetStateAction<number[]>>;
}



export interface ItemBoxInputs {
    inputs: ItemInput[]
    setInputs: React.Dispatch<React.SetStateAction<Array<ItemInput>>>
    data: CategoryInput[]
    setData: React.Dispatch<React.SetStateAction<CategoryInput[]>>
    onSubmit: (input: ItemInput[]) => void;
    selected: number,
    setSelect: React.Dispatch<React.SetStateAction<number>>
    userItems: number[][],
    setUserItems: React.Dispatch<React.SetStateAction<number[][]>>,
    itemsUser: number[],
    setItemsUser: React.Dispatch<React.SetStateAction<number[]>>
}

export interface Receipt {
    ReceiptID: number,
    PurchaseDate: string,
    Seller: string
}

export interface BillSplit{
    Username:string, 
    Spent:number
}