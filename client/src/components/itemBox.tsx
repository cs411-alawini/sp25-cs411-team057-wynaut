import { stringify } from "querystring";
import React, { JSX, useState }  from "react";
import "../index.css";

export interface ItemInput {
    name: string;
    price: string;
    amount: number;
}

interface ItemBoxProps {
    onSubmit: (input: ItemInput[]) => void;
}

const ItemBox = (IBProps : ItemBoxProps) : JSX.Element => {
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
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
    };

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
