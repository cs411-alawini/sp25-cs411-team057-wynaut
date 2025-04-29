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
    const [data, setData] = useState<Array<any>>([]); //Its an array like this [[CategoryInput, oldname],[CategoryInput, oldname]...]; oldname = "" for new categories

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
                curr_data.push([json[i], json[i].Category]);
            }
            setData(curr_data);
            setLoaded(true);
        } catch (error) {
            console.error((error as Error).message);
        }

        //TEST CODE
        // let test_data: Array<CategoryInput> = [
        //     { Category: "test1",Budget: 10, Spent: 13 },
        // ];
        // let curr_data = [...data];
        // curr_data.splice(0);
        // for (let i = 0; i < test_data.length; i++) {
        //     curr_data.push([test_data[i], test_data[i].Category]);
        // }
        // setData(curr_data);
        // setLoaded(true);
        //_____
    }

    async function submit() {
        try {
            const response = await fetch("http://localhost:3001/updateBudget", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "PUT",
                body: JSON.stringify({user: username, new: data}),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let res = JSON.parse(await response.json());
        } catch (error) {
            console.error((error as Error).message);
        }
    }
    async function deleteCata(cataName : string) {
        try {
            const response = await fetch("http://localhost:3001/removeCategory", {
                //CHANGE ENDPOINT HERE
                headers: { "Content-type": "application/json" },
                method: "POST",
                body: JSON.stringify({user: username, Category: cataName}),
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
                                            Category: "CategoryName",
                                            Budget: 0,
                                            Spent: 0,
                                        },
                                        "",
                                    ]);
                                    console.log(curr_data)
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
                                    value={categoryIn[0].Category}
                                    onChange={(event) => {
                                        let curr_data = [...data];
                                        curr_data[index][0].Category =
                                            event.target.value;
                                        setData([...curr_data]);
                                    }}
                                />
                                <input
                                    className="general-outline"
                                    value={categoryIn[0].Budget}
                                    onChange={(event) => {
                                        let curr_data = [...data];
                                        if (
                                            !isNaN(Number(event.target.value))
                                        ) {
                                            curr_data[index][0].Budget =
                                                parseInt(event.target.value);
                                        }
                                        if (event.target.value === "") {
                                            curr_data[index][0].Budget = 0;
                                        }
                                        setData([...curr_data]);
                                    }}
                                />
                                <input
                                    className="general-outline"
                                    value={categoryIn[0].Spent}
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
                                        deleteCata(categoryIn[0].Category)
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
