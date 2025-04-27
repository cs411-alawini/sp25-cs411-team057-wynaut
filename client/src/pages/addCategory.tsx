import React, { JSX, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";
import { UsernameInput } from "../components/interfaces";


const AddCategory = ({ username }: UsernameInput): JSX.Element => {
    return (
        <div>
            <h1 className="container">
                <div className="general-outline">
                    New Category
                    <Link to="/">
                        <button className="input-button">Return to Home</button>
                    </Link>
                </div>
            </h1>
        </div>
    );
};

export default AddCategory;
