import React, { JSX, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import { UsernameInput, CategoryInput } from "../components/interfaces";


const ViewCategory = ({ username }: UsernameInput): JSX.Element => {

    const [data, setData] = useState<Array<CategoryInput>>([]);
    async function getCategories() {
        try {
            const response = await fetch("http://localhost:3001/ViewCategory", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "Get",
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
    
            const json : CategoryInput= await response.json();
            return json;
        } catch (error) {
            console.error((error as Error).message);
        }
    }
    getCategories()

    return (
        <div>
            <h1 className="container">
                <div className="general-outline">
                    Categories
                    <Link to="/">
                        <button className="input-button">Return to Home</button>
                    </Link>
                </div>
            </h1>
        </div>
    );
};

export default ViewCategory;
