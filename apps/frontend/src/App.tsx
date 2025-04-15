    import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import ServiceRequestPage from './routes/TransportationRequestPage.tsx';
import ServiceRequestDisplayPage from './routes/ServiceRequestDisplayPage.tsx';
import DirectoryDisplayPage from './routes/DirectoryDisplayPage.tsx';
import ImportExportDirectoryPage from './routes/ImportExportDirectoryPage.tsx';
import SanitationRequestPage from './components/SanitationRequestComponent.tsx';
import SanitationRequestDisplayPage from './routes/SanitationRequestDisplayPage.tsx';

import TranslationServiceRequestPage from './routes/TranslationServiceRequestPage.tsx';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ShadSidebar } from '@/components/ui/shadsidebar.tsx';
import {MapPage} from "@/routes/MapPage.tsx";

function App() {
    return (
        <SidebarProvider defaultOpen={false}>
            <div className="h-dvh flex flex-col w-full max-w-full">
                <div className="h-16 sticky top-0 z-50 bg-white shadow-md">
                    <LogoBar />
                </div>
                <BrowserRouter>
                    <div className="flex flex-row flex-1 overflow-hidden">
                        <ShadSidebar />
                        <main className="flex-1 overflow-auto">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/Login" element={<LoginPage />} />
                                <Route path="/Home" element={<HomePage />} />
                                <Route
                                    path="/ServiceRequestPage"
                                    element={<ServiceRequestPage />}
                                />
                                <Route
                                    path="/ServiceRequestDisplay"
                                    element={<ServiceRequestDisplayPage />}
                                />
                                <Route
                                    path="/ImportExportDirectory"
                                    element={<ImportExportDirectoryPage />}
                                />
                                <Route
                                    path="/DirectoryDisplay"
                                    element={<DirectoryDisplayPage />}
                                />
                                <Route
                                  path="/MapPage"
                                  element={<MapPage />}
                                />

                                <Route
                                  path="/TranslationServiceRequestPage"
                                  element={<TranslationServiceRequestPage />}
                                 />
                        <Route path="/SanitationRequest" element={<SanitationRequestPage />} />
                        <Route path="/SanitationRequestDisplayPage" element={<SanitationRequestDisplayPage />} />

                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </div>
        </SidebarProvider>
    );
}

export default App;
