import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AddReceipt from "./pages/addReceipt";

const App: React.FC = () => {

    return (
        <Router>
            <Routes>
                <Route path="/AddReceipt" element={<AddReceipt />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
