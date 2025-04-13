import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar.tsx';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import ServiceRequestPage from './routes/TransportationRequestPage.tsx';
import ServiceRequestDisplayPage from './routes/ServiceRequestDisplayPage.tsx';
import DirectoryDisplayPage from './routes/DirectoryDisplayPage.tsx';
import ImportExportDirectoryPage from './routes/ImportExportDirectoryPage.tsx';
import ServiceRequestSelectPage from "@/routes/ServiceRequestSelectPage.tsx";

function App() {
    return(
        <div className="h-dvh flex flex-col">
            <div>
                <LogoBar />
            </div>
            <BrowserRouter>
                <div className="flex flex-row flex-1">
                    <div className="basis-1/6">
                        <NavBar />
                    </div>
                    <div className="basis-5/6">
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/Login" element={<LoginPage />} />
                            <Route path="/Home" element={<HomePage />} />
                            <Route path="/ServiceRequestPage" element={<ServiceRequestPage />} />
                            <Route path="/ServiceRequestDisplay" element={<ServiceRequestDisplayPage />} />
                            <Route path="/ImportExportDirectory" element={<ImportExportDirectoryPage />} />
                            <Route path="/DirectoryDisplay" element={<DirectoryDisplayPage />} />
                            <Route path="/ServiceRequestSelectPage" element={<ServiceRequestSelectPage />} />
                        </Routes>
                    </div>
                </div>

            </BrowserRouter>
        </div>
    )


}



export default App;
