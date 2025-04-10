import React from 'react';

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
        </div>
    );
};

export default HomePage;