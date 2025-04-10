import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";



const HomePage: React.FC = () => {



    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>Smart Spender</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div></div>
                <div>
                    <button style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc' }}>All</button>
                    <button style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc' }}>Past Month</button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <h1>Chart</h1>
                <h2>Label Goes Here</h2>
            </div>
        <div className='container'>
            <h1> Home Page :D</h1>
            <Link to ="/AddReceipt">
                <button className='input-button'> 
                    Manual Receipt Adder
                </button>
            </Link>
            </div>
        </div>
    );
};

export default HomePage;