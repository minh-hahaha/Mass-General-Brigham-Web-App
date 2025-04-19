import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import TransportationRequestPage from './routes/TransportationRequestPage.tsx';
import ServiceRequestDisplayPage from './routes/ServiceRequestDisplayPage.tsx';
import DirectoryDisplayPage from './routes/DirectoryDisplayPage.tsx';
import ImportExportDirectoryPage from './routes/ImportExportDirectoryPage.tsx';
import SanitationRequestPage from './components/SanitationRequestComponent.tsx';
import TransportRequestPage from "./routes/TransportationRequestPage.tsx";
import TranslationServiceRequestPage from './routes/TranslationServiceRequestPage.tsx';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ShadSidebar } from '@/components/ui/shadsidebar.tsx';
import {MapPage} from "@/routes/MapPage.tsx";
import MapViewPage from "@/routes/MapViewPage.tsx";
import SanitationRequestDisplayPage from "@/routes/SanitationRequestDisplayPage.tsx";
import ServiceRequestSelectPage from "@/routes/ServiceRequestSelectPage.tsx";
import MaintenanceRequestPage from "@/routes/MaintenanceRequestPage.tsx";
import Cookies from "js-cookie";

function App() {
    const defaultOpen = Cookies.get("sidebar_state") === 'true';

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
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
                                    path="/TransportationRequestPage"
                                    element={<TransportRequestPage />}
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
                                path="/MapView"
                                element={<MapViewPage/>}
                                />

                                <Route
                                    path="/TranslationServiceRequestPage"
                                    element={<TranslationServiceRequestPage />}
                                />

                                <Route
                                    path="/SanitationRequest"
                                    element={<SanitationRequestPage />}
                                />
                        <Route path="/SanitationRequest" element={<SanitationRequestPage />} />
                        <Route path="/SanitationRequestDisplayPage" element={<SanitationRequestDisplayPage />} />

                                <Route
                                    path="/MaintenancePage"
                                    element={<MaintenanceRequestPage />}
                                />
                                <Route
                                    path="/TransportationRequestPage"
                                    element={<TransportationRequestPage />}
                                />
                                <Route
                                    path="/ServiceRequestSelectPage"
                                    element={<ServiceRequestSelectPage />}
                                />
                                <Route
                                    path={"/MedicalDeviceRequestPage"}
                                    element={<MedicalDeviceServiceRequestPage/>}
                                />
                                <Route
                                    path={"/MedicalDeviceDisplayPage"}
                                    element={<MedicalDeviceServiceDisplayPage/>}
                                />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </div>
        </SidebarProvider>
    );
}

export default App;
