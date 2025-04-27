import React, {useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import AddReceipt from "./pages/addReceipt";
import ViewReciept from "./pages/viewReceipt";
import ViewCategory from "./pages/viewCategory";

const App: React.FC = () => {
    const [username, setUsername] = useState("Test");
    return (
        <Router>
            <Routes>
                <Route path="/AddReceipt" element={<AddReceipt username={username}/>}  />
                <Route path="/ViewCategory" element={<ViewCategory username={username}/>}  />
                <Route path="/ViewReceipt" element={<ViewReciept username={username}/>}  />
                <Route path="/" element={<HomePage username={username} setUsername={setUsername}/>} />
            </Routes>
        </Router>
    );
};

export default App;
