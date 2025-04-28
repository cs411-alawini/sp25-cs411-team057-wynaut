export interface UsernameInput {
    username: string;
}

export interface ItemInput {
    name: string;
    price: string;
    amount: number;
    category: string;
}

export interface CategoryInput {
    category: string;
    budget: number;
    spent: number;
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

export interface UserState{
    username : string
    setUsername: React.Dispatch<React.SetStateAction<string>>
}

export interface ItemBoxInputs {
    data: any[]
    setData: React.Dispatch<React.SetStateAction<any[]>>
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
    UserID: number,
    PurchaseDate: string,
    Seller: string
}