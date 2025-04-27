import React, {useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AddReceipt from "./pages/addReceipt";

export interface UserState{
    username : string
    setUsername: React.Dispatch<React.SetStateAction<string>>
}

const App: React.FC = () => {
    const [username, setUsername] = useState("Test");


    return (
        <Router>
            <Routes>
                <Route path="/AddReceipt" element={<AddReceipt username={username}/>}  />
                <Route path="/" element={<HomePage username={username} setUsername={setUsername}/>} />
            </Routes>
        </Router>
    );
};

export default App;
