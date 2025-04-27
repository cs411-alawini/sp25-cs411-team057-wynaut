import { stringify } from "querystring";
import React, { JSX, useState }  from "react";
import "../index.css";
import { ItemInput, ItemBoxInputs } from "./interfaces";




const ItemBox = (self : ItemBoxInputs) : JSX.Element => {
    const [inputs, setInputs] = useState([
        { name: "Enter Item Name", price: "0.00", amount: 0 },
    ]);

    const submitInput = () => {
        for (let i = 0; i < self.itemsUser.length; i++){
            if (self.itemsUser[i] == 0){
                return;
            }
        }
        self.onSubmit(inputs);
    };

    const handleAddInput = () => {
        setInputs([
            ...inputs,
            { name: "Enter Item Name", price: "0.00", amount: 0 },
        ]);

        let curr_itemUsers = [...self.itemsUser];
        curr_itemUsers.push(0);
        self.setItemsUser(curr_itemUsers);
    };

    const handleChange = (event: any, index: number, inputIndex: number) => {
        let value: string = event.target.value;
        let onChangeValue: ItemInput[] = [...inputs];

        // console.log(!isNaN(parseFloat("012asdasd")));
        // console.log(parseFloat("a012asdasd"));

        let ans: ItemInput = onChangeValue[index];
        if (inputIndex === 0) {
            ans.name = value;
        }
        if (inputIndex === 1 && !isNaN(Number(value))) {
            if (value === "") {
                //If nothing, make it 0
                ans.price = "0";
            } else if (value.indexOf(".") === -1) {
                //if no decimal and only 0
                ans.price = String(parseInt(value, 10));
            } else if (value.indexOf(".") >= value.length - 3) {
                //if has decimal, we keep under 2 deci places
                ans.price = value;
            }
        }
        if (inputIndex === 2 && (!isNaN(Number(value)) || value === "")) {
            if (value === "") {
                ans.amount = 0;
            } else {
                ans.amount = parseInt(value, 10);
            }
        }
        onChangeValue[index] = ans;
        setInputs(onChangeValue);
    };

    const handleDeleteInput = (index: number) => {
        let newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
        
        let curr_itemUsers = [...self.itemsUser];
        curr_itemUsers.splice(index,1);
        self.setItemsUser(curr_itemUsers);

        let curr_userItems = [...self.userItems];
        for (let i = 0; i < curr_userItems.length; i++){
            let equalJ = -1;
            for (let j = 0; j < curr_userItems[i].length; j++){
                if (curr_userItems[i][j] == index){
                    equalJ = j;
                }
                else if (curr_userItems[i][j] > index){
                    curr_userItems[i][j] -= 1;
                }
            }
            if (equalJ != -1){
                curr_userItems[i].splice(equalJ, 1);
            }
        }
        self.setUserItems(curr_userItems);
    };


    const setItemColor = (index: number) => {
        
        let findInd = (i : number) => {return i == index}
        let indExist = self.userItems[self.selected].findIndex(findInd);

        
        if (indExist != -1){
            return "pink";
        }
        return "white";
    }

    const setItemValidColor = (index: number) => {
        if (self.itemsUser[index] != 0){
            return "white";
        }
        return "red";
    }

    const selectItem = (index: number) => {
        let findInd = (i : number) => {return i == index}
        let indExist = self.userItems[self.selected].findIndex(findInd);
        let curr_userItems = [...self.userItems];
        let curr_itemUsers = [...self.itemsUser];


        if (indExist != -1){
            curr_userItems[self.selected].splice(indExist, 1);
            curr_itemUsers[index] -= 1
        }
        else{
            curr_userItems[self.selected].push(index);
            curr_itemUsers[index] += 1
        }
        self.setUserItems(curr_userItems);
        self.setItemsUser(curr_itemUsers);

        console.log(self.itemsUser);
    }

    return (
        <div className="container">
            <div>
                <button
                    onClick={() => handleAddInput()}
                    className="input-button"
                >
                    Add Item
                </button>
            </div>
            <div>
                <button onClick={() => submitInput()} className="input-button">
                    Submit
                </button>
            </div>
            {inputs.map((item, index) => (
                <div className="input-container" key={index}>
                    <input
                        style={{background : setItemValidColor(index)}}
                        name="name"
                        type="text"
                        value={item.name}
                        onChange={(event) => handleChange(event, index, 0)}
                        className="general-outline"
                    />
                    <input
                        name="price"
                        type="text"
                        value={item.price}
                        onChange={(event) => handleChange(event, index, 1)}
                        className="general-outline"
                    />
                    <input
                        name="amount"
                        type="text"
                        value={item.amount}
                        onChange={(event) => handleChange(event, index, 2)}
                        className="general-outline"
                    />
                    {
                        self.selected != -1 &&
                        <button
                            style={{background: setItemColor(index)}}
                            onClick={() => {selectItem(index)}}
                            className="input-button"
                        >
                            Select
                        </button>
                    }
                    
                    {inputs.length > 1 && (
                        <button
                            onClick={() => handleDeleteInput(index)}
                            className="input-button"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ItemBox;
