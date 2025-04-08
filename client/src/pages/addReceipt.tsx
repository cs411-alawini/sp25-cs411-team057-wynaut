import React from "react";
import InputBox, { ItemInput } from "../components/itemBox";

const AddReceipt: React.FC = () => {
    async function submitReceipt(inputs: ItemInput[]) {
        //Do something here
        console.log(inputs);
        const promptedValue = prompt(
            "Please enter a userID to store this with:"
        );
        console.log(promptedValue);
        const data = [inputs, promptedValue];
        try {
            const response = await fetch("/addReceipt", { //CHANGE ENDPOINT HERE
                method: "POST",
                body: JSON.stringify(data),
            });
            console.log("GOT HERE");
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json.status);
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    return (
        <div>
            <h1> Receipt Manual Inputter </h1>
            <InputBox onSubmit={submitReceipt} />
        </div>
    );
};

export default AddReceipt;
