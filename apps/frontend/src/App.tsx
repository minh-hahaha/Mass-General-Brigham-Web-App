import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import TransportationRequestPage from './routes/TransportationRequestPage.tsx';
import ServiceRequestDisplayPage from './routes/ServiceRequestDisplayPage.tsx';
import DirectoryDisplayPage from './routes/DirectoryDisplayPage.tsx';
import ImportExportDirectoryPage from './routes/ImportExportDirectoryPage.tsx';
import SanitationRequestPage from './routes/SanitationRequestComponent.tsx';
import TransportRequestPage from './routes/TransportationRequestPage.tsx';
import TranslationServiceRequestPage from './routes/TranslationServiceRequestPage.tsx';
import MedicalDeviceServiceRequestPage from './routes/MedicalDeviceServiceRequestPage.tsx';
import { MapPage } from '@/routes/MapPage.tsx';
import MapViewPage from '@/routes/MapViewPage.tsx';
import MaintenanceRequestPage from '@/routes/MaintenanceRequestPage.tsx';
import Cookies from 'js-cookie';
import NodeEditor from '@/routes/NodeEditor.tsx';
import AboutPage from '@/routes/AboutPage.tsx';
import {Auth0Provider} from "@auth0/auth0-react";
import {ROUTES} from "common/src/constants.ts";

import CreditsPage from "@/routes/CreditsPage.tsx";

function App() {
    const defaultOpen = Cookies.get('sidebar_state') === 'true';
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;

    return (
        <Auth0Provider
            clientId={clientID}
            domain={domain}
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
            cacheLocation="localstorage"
            onRedirectCallback={() => (window.location.href = '/MapPage')}
        >
            <div className="h-dvh flex flex-col w-full max-w-full">
                <div className="h-16 sticky top-0 z-50 bg-white shadow-md">
                    <LogoBar />
                </div>
                <BrowserRouter>
                    <div className="flex flex-row flex-1 overflow-hidden">
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
                                    element={
                                        <ImportExportDirectoryPage jsonRoute={ROUTES.DIRECTORY_JSON} csvRoute={ROUTES.DIRECTORY_CSV} />
                                    }
                                />
                                <Route
                                    path="/DirectoryDisplay"
                                    element={<DirectoryDisplayPage />}
                                />
                                <Route path="/MapEditorPage" element={<NodeEditor />} />
                                <Route path="/MapPage" element={<MapPage />} />
                                <Route path="/ViewMap" element={<MapViewPage />} />

                                <Route
                                    path="/TranslationServiceRequestPage"
                                    element={<TranslationServiceRequestPage />}
                                />

                                <Route
                                    path="/SanitationRequest"
                                    element={<SanitationRequestPage />}
                                />
                                <Route
                                    path="/SanitationRequest"
                                    element={<SanitationRequestPage />}
                                />

                                    <Route
                                        path="/MaintenancePage"
                                        element={<MaintenanceRequestPage />}
                                    />
                                    <Route
                                        path="/TransportationRequestPage"
                                        element={<TransportationRequestPage />}
                                    />
                                    <Route
                                        path={'/MedicalDevicePage'}
                                        element={<MedicalDeviceServiceRequestPage />}
                                    />
                                    <Route
                                        path="/AboutPage"
                                        element={<AboutPage />}
                                    />
                                    <Route
                                        path="/CreditsPage"
                                        element={<CreditsPage />}
                                    />
                                </Routes>
                            </main>
                        </div>
                    </BrowserRouter>
                </div>
        </Auth0Provider>
    );
}

export default App;
