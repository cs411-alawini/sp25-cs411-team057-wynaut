import React, {useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AddReceipt from "./pages/addReceipt";

export interface IDstate{
    userID : number
    setUserID: React.Dispatch<React.SetStateAction<number>>
}

const App: React.FC = () => {
    const [userID, setUserID] = useState(0);


    return (
        <Router>
            <Routes>
                <Route path="/AddReceipt" element={<AddReceipt userID={userID}/>}  />
                <Route path="/" element={<HomePage userID={userID} setUserID={setUserID}/>} />
            </Routes>
        </Router>
    );
};

export default App;
