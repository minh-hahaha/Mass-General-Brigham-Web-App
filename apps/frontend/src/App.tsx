import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar.tsx';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import ChestnutHillDirectory from './routes/ChestnutHillDirectory.tsx';
import ServiceRequestPage from './routes/ServiceRequestPage.tsx';

function App() {
    return(
        <>
        <div>
            <LogoBar />
        </div>
        <BrowserRouter>
            <div className="flex flex-row h-screen">
                <div className="basis-1/6">
                    <NavBar />
                </div>
                <div className="basis-5/6">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/Login" element={<LoginPage />} />
                        <Route path="/ChestnutHillDirectory" element={<ChestnutHillDirectory />} />
                        <Route path="/ServiceRequestPage" element={<ServiceRequestPage />} />

                    </Routes>
                </div>
            </div>

        </BrowserRouter>
        </>
    )


}



export default App;
