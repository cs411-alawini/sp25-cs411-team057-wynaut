import { stringify } from "querystring";
import React, { JSX, useState } from "react";
import "../index.css";
import { UserInput } from "./interfaces";
import { selected_button_color } from "../pages/addReceipt";


const UserBox = (self: UserInput): JSX.Element => {
    const [status, setStatus] = useState(0); //-1 = is not a user/error; 0 = have not checked; 1 = checking; 2 = is user

    async function handleAddInput() {
        if (self.userInputs[self.userInputs.length - 1] == "") {
            //If nothing there
            return;
        }

        let findUser = (value: string) => {
            return value == self.userInputs[self.userInputs.length - 1];
        };
        if (self.userInputs.slice(0,-1).find(findUser) != undefined) {
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/CheckUser", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify(
                    {username: self.userInputs[self.userInputs.length - 1]}
                ), //Last name in inputs array
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let res = JSON.parse(await response.json());

            if (res) {
                let curr_input = [...self.userInputs];
                curr_input.push("");
                self.setUserInputs(curr_input);

                let curr_userItems = [...self.userItems];
                curr_userItems.push([]);
                self.setUserItems(curr_userItems);
            }
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    const handleChange = (event: any) => {
        let curr_input = [...self.userInputs];
        curr_input[self.userInputs.length - 1] = event.target.value;
        self.setUserInputs(curr_input);
        console.log(curr_input);
    };

    const handleDeleteInput = (index: number) => {
        const newArray = [...self.userInputs];
        newArray.splice(index, 1);
        self.setUserInputs(newArray);

        let curr_itemUsers = [...self.itemsUser];
        for (let i = 0; i < self.userItems[index].length; i++) {
            curr_itemUsers[self.userItems[index][i]] -= 1;
        }
        self.setItemsUser(curr_itemUsers);

        const curr_userItems = [...self.userItems];
        curr_userItems.splice(index, 1);
        self.setUserItems(curr_userItems);

        if (self.selected == index) {
            self.setSelect(-1);
        }
    };

    const setColor = (index: number) => {
        if (index == self.selected) {
            return selected_button_color;
        }
        return "white";
    };
    return (
        <div className="container">
            <div>
                <button
                    onClick={() => handleAddInput()}
                    className="input-button"
                >
                    Add User
                </button>
            </div>
            {self.userInputs.map((user, index) => (
                <div className="input-container" key={index}>
                    {index < self.userInputs.length - 1 && (
                        <button
                            style={{ background: setColor(index) }}
                            onClick={() => {
                                if (self.selected != index) {
                                    self.setSelect(index);
                                } else {
                                    self.setSelect(-1);
                                }
                            }}
                            className="input-button"
                        >
                            {user}
                        </button>
                    )}
                    {index == self.userInputs.length - 1 && (
                        <input
                            name="usr"
                            value={user}
                            onChange={(event) => handleChange(event)}
                            className="general-outline"
                        />
                    )}

                    {index > 0 && index < self.userInputs.length - 1 && (
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

export default UserBox;
