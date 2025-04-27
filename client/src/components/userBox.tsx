import { stringify } from "querystring";
import React, { JSX, useState } from "react";
import "../index.css";

export interface UserInput {
    username: string,
    selected: number,
    setSelect: React.Dispatch<React.SetStateAction<number>>,
    userItems: number[][],
    setUserItems: React.Dispatch<React.SetStateAction<number[][]>>,
    itemsUser: number[],
    setItemsUser: React.Dispatch<React.SetStateAction<number[]>>
}

const UserBox = (self: UserInput): JSX.Element => {
    const [inputs, setInputs] = useState([self.username, ""]);
    const [status, setStatus] = useState(0); //-1 = is not a user/error; 0 = have not checked; 1 = checking; 2 = is user

    async function handleAddInput() {
        if (inputs[inputs.length - 1] == "") {
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/checkUser", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify(inputs[inputs.length - 1]), //Last name in inputs array
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let res = JSON.parse(await response.json());
        } catch (error) {
            console.error((error as Error).message);
        }

        // CHANGE STATUS
        let curr_input = [...inputs];
        curr_input.push("");
        setInputs(curr_input);

        let curr_userItems = [...self.userItems];
        curr_userItems.push([]);
        self.setUserItems(curr_userItems);
    }

    const handleChange = (event: any) => {
        let curr_input = [...inputs];
        curr_input[inputs.length - 1] = event.target.value;
        setInputs(curr_input);
        console.log(curr_input);
    };

    const handleDeleteInput = (index: number) => {
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);

        let curr_itemUsers = [...self.itemsUser];
        for (let i = 0; i < self.userItems[index].length; i++){
            curr_itemUsers[self.userItems[index][i]] -= 1
        }
        self.setItemsUser(curr_itemUsers);

        const curr_userItems = [...self.userItems];
        curr_userItems.splice(index, 1);
        self.setUserItems(curr_userItems);


        if (self.selected == index){
            self.setSelect(-1);
        }
    };

    const setColor = (index: number) => {
        if (index == self.selected) {
            return "pink";
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
            {inputs.map((user, index) => (
                <div className="input-container" key={index}>
                    {index < inputs.length - 1 && (
                        <button
                            style={{ background: setColor(index) }}
                            onClick={() => {
                                if (self.selected != index) {
                                    self.setSelect(index);
                                }
                                else{
                                    self.setSelect(-1);
                                }
                            }}
                            className="input-button"
                        >
                            {user}
                        </button>
                    )}
                    {index == inputs.length - 1 && (
                        <input
                            name="usr"
                            value={user}
                            onChange={(event) => handleChange(event)}
                            className="general-outline"
                        />
                    )}

                    {index > 0 && index < inputs.length - 1 && (
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
