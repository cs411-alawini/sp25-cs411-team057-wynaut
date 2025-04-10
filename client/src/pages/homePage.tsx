import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";



const HomePage: React.FC = () => {



    return (
        <div className='container'>
            <h1> Home Page :D</h1>
            <Link to ="/AddReceipt">
                <button className='input-button'> 
                    Manual Receipt Adder
                </button>
            </Link>
        </div>
    );
};


export default HomePage;