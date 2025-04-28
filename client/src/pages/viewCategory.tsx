import React, { JSX, useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useAsyncError,
} from "react-router-dom";
import { UsernameInput, CategoryInput } from "../components/interfaces";

const ViewCategory = ({ username }: UsernameInput): JSX.Element => {
    const [data, setData] = useState<Array<any>>([]); //Its an array like this [[CategoryInput, index],[CategoryInput, index]...];
    // index = -1 for new categories and ordered 0->length-1 for existing ones

    const [loaded, setLoaded] = useState(false);
    async function getCategories() {
        try {
            const response = await fetch("http://localhost:3001/ViewCategory", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify({user: username})
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Response
            const json: Array<CategoryInput> = await response.json();
            let curr_data = [...data];
            curr_data.splice(0);
            for (let i = 0; i < json.length; i++) {
                curr_data.push([json[i], i]);
            }
            setData(curr_data);
            setLoaded(true);
        } catch (error) {
            console.error((error as Error).message);
        }

        //TEST CODE
        let test_data: Array<CategoryInput> = [
            { category: "test1", budget: 10, spent: 13 },
            { category: "test2", budget: 12, spent: 11 },
            { category: "test3", budget: 14, spent: 16 },
            { category: "test4", budget: 15, spent: 14 },
            { category: "test5", budget: 16, spent: 21 },
        ];
        let curr_data = [...data];
        curr_data.splice(0);
        for (let i = 0; i < test_data.length; i++) {
            curr_data.push([test_data[i], i]);
        }
        setData(curr_data);
        setLoaded(true);
        //_____
    }

    async function submit() {
        try {
            const response = await fetch("http://localhost:3001/checkUser", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let res = JSON.parse(await response.json());
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    useEffect(() => {
        getCategories();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    if (username == "") {
        //To stop people from bypassing login
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h1 className="container">
                <div className="general-outline">
                    Categories
                    <Link to="/">
                        <button className="input-button">Return to Home</button>
                    </Link>
                </div>
                {!loaded && <text> Loading... </text>}
                {loaded && (
                    <div>
                        <div className="input-container">
                            <button className="input-button" onClick={submit}>
                                Save Changes
                            </button>
                            <button
                                className="input-button"
                                onClick={() => {
                                    let curr_data = [...data];
                                    curr_data.push([
                                        {
                                            category: "CategoryName",
                                            budget: 0,
                                            spent: 0,
                                        },
                                        -1,
                                    ]);
                                    setData([...curr_data]);
                                }}
                            >
                                AddCategory
                            </button>
                        </div>
                        <div className="input-container">
                            <input
                                className="general"
                                value={"Name"}
                                readOnly
                            />
                            <input
                                className="general"
                                value={"Budget"}
                                readOnly
                            />
                            <input
                                className="general"
                                value={"Spent"}
                                readOnly
                            />
                        </div>

                        {data.map((categoryIn, index) => (
                            <div className="input-container" key={index}>
                                <input
                                    className="general-outline"
                                    value={categoryIn[0].category}
                                    onChange={(event) => {
                                        let curr_data = [...data];
                                        curr_data[index][0].category =
                                            event.target.value;
                                        setData([...curr_data]);
                                    }}
                                />
                                <input
                                    className="general-outline"
                                    value={categoryIn[0].budget}
                                    onChange={(event) => {
                                        let curr_data = [...data];
                                        if (
                                            !isNaN(
                                                Number(event.target.value)
                                            ) ||
                                            event.target.value === ""
                                        ) {
                                            curr_data[index][0].budget =
                                                parseInt(event.target.value);
                                        }
                                        setData([...curr_data]);
                                    }}
                                />
                                <input
                                    className="general-outline"
                                    value={categoryIn[0].spent}
                                    readOnly
                                />
                                <button
                                    className="input-button"
                                    onClick={() => {
                                        let userInput =
                                            window.confirm("Are you sure?");
                                        if (userInput) {
                                            let curr_data = [...data];
                                            curr_data.splice(index, 1);
                                            setData([...curr_data]);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </h1>
        </div>
    );
};

export default ViewCategory;
