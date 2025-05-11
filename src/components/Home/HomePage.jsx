import React from 'react';

const Home = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <img 
                src="/path/to/logo1.png" 
                alt="Logo 1" 
                style={{ width: '100px', height: 'auto' }} 
            />
            <img 
                src="/path/to/logo2.png" 
                alt="Logo 2" 
                style={{ width: '100px', height: 'auto' }} 
            />
        </div>
    );
};

export default Home;
