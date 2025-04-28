import { stringify } from "querystring";
import React, { JSX, useEffect, useState } from "react";
import "../index.css";
import { ItemInput, ItemBoxInputs, CategoryInput } from "./interfaces";
import { selected_button_color } from "../pages/addReceipt";

const ItemBox = (self: ItemBoxInputs): JSX.Element => {

    const [showCata, setShowCata] = useState(false);
    const [cataArr, setCataArr] = useState([-1]);
    const [submitStatus, setSubmitStatus] = useState(0); //0 no err; 1 not all items have user; 2 not all items have a cata

    const loadCataArr = () => {
        let new_cataArr = [...cataArr]
        new_cataArr.splice(0)
        console.log("ITEMBOX load data", self.data)
        self.inputs.forEach((element) => {
            if (element.category == ""){
                new_cataArr.push(-1)
            }
            else{
                let ind = self.data.findIndex((value : CategoryInput) => {
                    return value.category == element.category})
                new_cataArr.push(ind)
            }
        })
        setCataArr(new_cataArr)
    }

    const submitInput = () => {
        for (let i = 0; i < self.itemsUser.length; i++) {
            if (self.itemsUser[i] == 0) {
                setSubmitStatus(1);
                return;
            }
        }
        setSubmitStatus(0);
        self.onSubmit(self.inputs);
    };

    const handleAddInput = () => {
        self.setInputs([
            ...self.inputs,
            { name: "Enter Item Name", price: "0.00", amount: 0, category: "" },
        ]);

        setCataArr([...cataArr, -1]);

        let curr_itemUsers = [...self.itemsUser];
        curr_itemUsers.push(0);
        self.setItemsUser(curr_itemUsers);

        console.log(self.data);
    };

    const handleChange = (event: any, index: number, inputIndex: number) => {
        let value: string = event.target.value;
        let onChangeValue: ItemInput[] = [...self.inputs];

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
        self.setInputs(onChangeValue);
    };

    const handleDeleteInput = (index: number) => {
        let newArray = [...self.inputs];
        newArray.splice(index, 1);
        self.setInputs(newArray);

        let newCataArray = [...cataArr];
        newCataArray.splice(index, 1);
        setCataArr(newCataArray);

        let curr_itemUsers = [...self.itemsUser];
        curr_itemUsers.splice(index, 1);
        self.setItemsUser(curr_itemUsers);

        let curr_userItems = [...self.userItems];
        for (let i = 0; i < curr_userItems.length; i++) {
            let equalJ = -1;
            for (let j = 0; j < curr_userItems[i].length; j++) {
                if (curr_userItems[i][j] == index) {
                    equalJ = j;
                } else if (curr_userItems[i][j] > index) {
                    curr_userItems[i][j] -= 1;
                }
            }
            if (equalJ != -1) {
                curr_userItems[i].splice(equalJ, 1);
            }
        }
        self.setUserItems(curr_userItems);
    };

    const setItemColor = (index: number) => {
        let findInd = (i: number) => {
            return i == index;
        };
        let indExist = self.userItems[self.selected].findIndex(findInd);

        if (indExist != -1) {
            return selected_button_color;
        }
        return "white";
    };

    const setItemValidColor = (index: number) => {
        if (self.itemsUser[index] != 0) {
            return "white";
        }
        return "pink";
    };

    const setCataColor = (index: number, cataIndex: number) => {
        if (cataIndex != cataArr[index]) {
            return "white";
        }
        return selected_button_color;
    };

    const selectItem = (index: number) => {
        let findInd = (i: number) => {
            return i == index;
        };
        let indExist = self.userItems[self.selected].findIndex(findInd);
        let curr_userItems = [...self.userItems];
        let curr_itemUsers = [...self.itemsUser];

        if (indExist != -1) {
            curr_userItems[self.selected].splice(indExist, 1);
            curr_itemUsers[index] -= 1;
        } else {
            curr_userItems[self.selected].push(index);
            curr_itemUsers[index] += 1;
        }
        self.setUserItems(curr_userItems);
        self.setItemsUser(curr_itemUsers);

        console.log(self.itemsUser);
    };


    useEffect(() => {
            loadCataArr();
        }, []);
    return (
        <div className="container">
            <div>
                <button
                    onClick={() => handleAddInput()}
                    className="input-button"
                >
                    Add Item
                </button>

                <button
                    onClick={() => {
                        if (showCata) {
                            setShowCata(false);
                        } else {
                            setShowCata(true);
                        }
                    }}
                    className="input-button"
                >
                    Show/Hide Category
                </button>

                <button onClick={() => submitInput()} className="input-button">
                    Submit
                </button>
                {submitStatus == 1 && (
                    <text
                        className="general-outline"
                        style={{ background: "pink" }}
                    >
                        {" "}
                        Not all items have user!{" "}
                    </text>
                )}
                {/* {submitStatus == 2 && (
                    <text
                        className="general-outline"
                        style={{ background: "pink" }}
                    >
                        {" "}
                        Not all items have catagory!{" "}
                    </text>
                )} */}
            </div>

            <div className="input-container">
                <input value={"Name"} className="general" readOnly />
                <input value={"Price"} className="general" readOnly />
                <input value={"Quantity"} className="general" readOnly />
            </div>
            {self.inputs.map((item, index) => (
                <div className="container">
                    <div className="input-container" key={index}>
                        <input
                            style={{ background: setItemValidColor(index) }}
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
                        {self.selected != -1 && (
                            <button
                                style={{ background: setItemColor(index) }}
                                onClick={() => {
                                    selectItem(index);
                                }}
                                className="input-button"
                            >
                                Select
                            </button>
                        )}

                        {self.inputs.length > 1 && (
                            <button
                                onClick={() => handleDeleteInput(index)}
                                className="input-button"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <div className="container">
                        {showCata &&
                            self.data.map((category, cataIndex) => (
                                <button
                                    style={{
                                        background: setCataColor(
                                            index,
                                            cataIndex
                                        ),
                                    }}
                                    className="input-button"
                                    onClick={() => {
                                        let curr_cataArr = [...cataArr];
                                        let curr_inputs = [...self.inputs];

                                        if (curr_cataArr[index] == cataIndex) {
                                            curr_cataArr[index] = -1;
                                            curr_inputs[index].category = "";
                                        } else {
                                            curr_cataArr[index] = cataIndex;
                                            curr_inputs[index].category =
                                                self.data[
                                                    cataIndex
                                                ].category;
                                        }
                                        setCataArr(curr_cataArr);
                                        self.setInputs(curr_inputs);
                                        console.log(cataArr);
                                    }}
                                >
                                    {category.category}
                                </button>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemBox;
