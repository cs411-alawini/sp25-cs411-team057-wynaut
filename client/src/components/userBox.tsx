import { stringify } from "querystring";
import React, { JSX, useState } from "react";
import "../index.css";

export interface UserInput {
    username: string;
}

const UserBox = (self : UserInput): JSX.Element => {
    const [inputs, setInputs] = useState([{username: self.username},{ username: "" }]);
    const [status, setStatus] = useState(0) //-1 = is not a user/error 0 = have not checked 1 = checking 2 = is user

    async function handleAddInput(){
        try {
            const response = await fetch("http://localhost:3001/checkUser", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify(inputs[inputs.length-1]),
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
        curr_input[inputs.length] = {username: ""};
        setInputs(curr_input);
    };

    const handleChange = (event: any) => {
        let curr_input = [...inputs];
        curr_input[inputs.length-1] = event.target.value;
        setInputs(curr_input);
    };

    const handleDeleteInput = () => {
        // const newArray = [...inputs];
        // newArray.splice(newArray.length, 1);
        // setInputs(newArray);
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
                        <text>
                            {user.username}
                        </text>
                    )}
                    {index == inputs.length - 1 && (
                        <input
                            name="usr"
                            value={user.username}
                            onChange={(event) => handleChange(event)}
                            className="general-outline"
                        />
                    )}

                    {index > 2 &&
                    <button
                        onClick={() => handleDeleteInput()}
                        className="input-button"
                    >
                        Delete
                    </button>}
                </div>
            ))}
        </div>
    );
};

export default UserBox;
