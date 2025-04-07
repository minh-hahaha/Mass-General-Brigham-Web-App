import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar.tsx';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import ChestnutHillDirectory from './routes/ChestnutHillDirectory.tsx';
import ServiceRequestPage from './routes/ServiceRequestPage.tsx';
import DataTable from './routes/DataTable';
function App() {
    return(
        <>
        <div>
            <LogoBar />
        </div>
        <BrowserRouter>
            <div className="flex flex-row h-screen">
                <div className="basis-1/7 transition-[delay-100 duration-500 ease-in-out] hover:basis-2/7">
                    <NavBar />
                </div>
                <div className="basis-6/7">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/Login" element={<LoginPage />} />
                        <Route path="/ChestnutHillDirectory" element={<ChestnutHillDirectory />} />
                        <Route path="/ServiceRequestPage" element={<ServiceRequestPage />} />
                        <Route path="/DataTable" element={<DataTable />} />

                    </Routes>
                </div>
            </div>

        </BrowserRouter>
        </>
    )


}



export default App;
