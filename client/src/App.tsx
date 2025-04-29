import React, {useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import AddReceipt from "./pages/addReceipt";
import ViewReceipt from "./pages/viewReceipt";
import ViewCategory from "./pages/viewCategory";
import AddIncome from "./pages/addIncome";

const App: React.FC = () => {
    const [username, setUsername] = useState("Test");
    const [receiptID, setReceiptID] = useState(-1);

    return (
        <Router>
            <Routes>
                <Route path="/AddReceipt" element={<AddReceipt username={username} setUsername={setUsername} receiptID={receiptID} setReceiptID={setReceiptID}/>}  />
                <Route path="/ViewCategory" element={<ViewCategory username={username}/>}  />
                <Route path="/ViewReceipt" element={<ViewReceipt username={username} setUsername={setUsername} receiptID={receiptID} setReceiptID={setReceiptID}/>}  />
                <Route path="/AddIncome" element={<AddIncome username={username}/>}  />
                <Route path="/" element={<HomePage username={username} setUsername={setUsername} receiptID={receiptID} setReceiptID={setReceiptID}/>} />
            </Routes>
        </Router>
    );
};

export default App;
