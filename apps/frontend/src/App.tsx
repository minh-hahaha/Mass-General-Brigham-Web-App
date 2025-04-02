import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar.tsx';
import HomePage from './routes/HomePage.tsx';
import ChestnutHillDirectory from './routes/ChestnutHillDirectory.tsx';

function App() {
    return(
        <BrowserRouter>
            <NavBar />

            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
            <Routes>
                <Route path="/ChestnutHillDirectory" element={<ChestnutHillDirectory />} />
            </Routes>
        </BrowserRouter>
    )

}



export default App;
