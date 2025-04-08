import { stringify } from "querystring";
import React, { useState } from "react";
import { TupleType } from "typescript";

export interface ItemInput {
    name: string;
    price: string;
    amount: number;
}

interface ItemBoxProps {
    onSubmit: (input: ItemInput[]) => void;
}

const ItemBox: React.FC<ItemBoxProps> = (IBProps) => {
    const [inputs, setInputs] = useState([
        { name: "Enter Item Name", price: "0.00", amount: 0 },
    ]);

    const submitInput = () => {
        IBProps.onSubmit(inputs);
    };

    const handleAddInput = () => {
        setInputs([
            ...inputs,
            { name: "Enter Item Name", price: "0.00", amount: 0 },
        ]);
    };

    const printer = (event: any) => {
        console.log(event.target.value);
    };
    const handleChange = (event: any, index: number, inputIndex: number) => {
        let value: string = event.target.value;
        let onChangeValue: ItemInput[] = [...inputs];

        console.log(!isNaN(parseFloat("012asdasd")));
        console.log(parseFloat("a012asdasd"));

        let ans: ItemInput = onChangeValue[index];
        if (inputIndex === 0) {
            ans.name = value;
        }
        if (inputIndex === 1 && !isNaN(Number(value))) {
            if (
                value.indexOf(".") >= value.length - 3 ||
                value.indexOf(".") === -1
            ) {
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
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
    };

    return (
        <div className="container">
            <div>
                <button onClick={() => handleAddInput()}>Add Item</button>
            </div>
            <div>
                <button onClick={() => submitInput()}>Submit</button>
            </div>
            {inputs.map((item, index) => (
                <div className="input_container" key={index}>
                    <input
                        name="name"
                        type="text"
                        value={item.name}
                        onChange={(event) => handleChange(event, index, 0)}
                    />
                    <input
                        name="price"
                        type="text"
                        value={item.price}
                        onChange={(event) => handleChange(event, index, 1)}
                    />
                    <input
                        name="amount"
                        type="text"
                        value={item.amount}
                        onChange={(event) => handleChange(event, index, 2)}
                    />
                    {inputs.length > 1 && (
                        <button onClick={() => handleDeleteInput(index)}>
                            -Delete-
                        </button>
                    )}
                </div>
            ))}
            <div className="body"> {JSON.stringify(inputs)} </div>
        </div>
    );
};

export default ItemBox;
