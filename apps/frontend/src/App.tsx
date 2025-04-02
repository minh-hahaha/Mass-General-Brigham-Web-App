import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar.tsx';
import HomePage from './routes/HomePage.tsx';
import ChestnutHillDirectory from './routes/ChestnutHillDirectory.tsx';

function App() {
    return(
        <BrowserRouter>
            <div className="flex flex-row h-screen">
                <div className="basis-1/4 bg-blue-500 bg-opacity-50 min-h-full ">
                    <NavBar />
                </div>
                <div className="basis-3/4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/ChestnutHillDirectory" element={<ChestnutHillDirectory />} />
                    </Routes>
                </div>
            </div>

        </BrowserRouter>
    )

}



export default App;
