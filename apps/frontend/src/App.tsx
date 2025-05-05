import React, {useState, useRef, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogoBar from './components/LogoBar.tsx';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage.tsx';
import TransportationRequestPage from './components/forms/TransportationRequestPage.tsx';
import ServiceRequestDisplayPage from './routes/ServiceRequestDisplayPage.tsx';
import DirectoryDisplayPage from './routes/DirectoryDisplayPage.tsx';
import ImportExportDirectoryPage from './routes/ImportExportDirectoryPage.tsx';
import SanitationRequestPage from './components/forms/SanitationRequestComponent.tsx';
import TranslationServiceRequestPage from './components/forms/TranslationServiceRequestPage.tsx';
import MedicalDeviceServiceRequestPage from './components/forms/MedicalDeviceServiceRequestPage.tsx'
import {MapPage} from "@/routes/MapPage.tsx";
import MapViewPage from "@/routes/MapViewPage.tsx";
import MaintenanceRequestPage from "@/components/forms/MaintenanceRequestPage.tsx";
import Cookies from "js-cookie";
import NodeEditor from '@/routes/NodeEditor.tsx';
import AboutPage from '@/routes/AboutPage.tsx';
import AccountPage from '@/routes/AccountPage.tsx'
import {Auth0Provider} from "@auth0/auth0-react";
import {ROUTES} from "common/src/constants.ts";

import CreditsPage from "@/routes/CreditsPage.tsx";

import Screensaver from './ScreenSaver.tsx';
import WongDinoGame from "@/routes/WongDinoGame.tsx";

const IDLE_TIMEOUT = 15000; // 30 seconds

function App() {
    const defaultOpen = Cookies.get('sidebar_state') === 'true';
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE

    const [isIdle, setIsIdle] = useState(false);
    const idleTimer = useRef<NodeJS.Timeout | null>(null);
    const isIdleRef = useRef(false); // <- new

    const resetTimer = () => {
        if (idleTimer.current) clearTimeout(idleTimer.current);

        // Exit screensaver if idle
        if (isIdleRef.current) {
            setIsIdle(false);
            isIdleRef.current = false;
        }

        idleTimer.current = setTimeout(() => {
            setIsIdle(true);
            isIdleRef.current = true;
        }, IDLE_TIMEOUT);
    };


    useEffect(() => {
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

        events.forEach((event) => window.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, []); // <-- no dependency on `isIdle`







    return (
        <Auth0Provider
            clientId={clientID}
            domain={domain}
            authorizationParams={{
                redirect_uri: window.location.origin,
                scope: 'openid profile email',
                audience: audience,
            }}
            cacheLocation="localstorage"
            onRedirectCallback={() => (window.location.href = '/MapPage')}
        >

            <div className="h-dvh flex flex-col w-full max-w-full">
                <div className="h-16 sticky top-0 z-50 bg-white shadow-md">
                    {/*{isIdle && <Screensaver />}*/}
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
                                    path="/ServiceRequestDisplay"
                                    element={<ServiceRequestDisplayPage />}
                                />
                                <Route
                                    path="/ImportExportDirectory"
                                    element={
                                        <ImportExportDirectoryPage
                                            jsonRoute={ROUTES.DIRECTORY_JSON}
                                            csvRoute={ROUTES.DIRECTORY_CSV}
                                        />
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
                                    element={<TranslationServiceRequestPage editData={undefined} />}
                                />

                                <Route
                                    path="/SanitationRequest"
                                    element={<SanitationRequestPage editData={undefined} />}
                                />

                                <Route
                                    path="/MaintenancePage"
                                    element={<MaintenanceRequestPage editData={undefined} />}
                                />
                                <Route
                                    path="/TransportationRequestPage"
                                    element={<TransportationRequestPage editData={undefined} />}
                                />
                                <Route
                                    path={'/MedicalDevicePage'}
                                    element={
                                        <MedicalDeviceServiceRequestPage editData={undefined} />
                                    }
                                />
                                <Route path="/AboutPage" element={<AboutPage />} />
                                <Route path="/CreditsPage" element={<CreditsPage />} />
                                <Route path="/AccountPage" element={<AccountPage />} />
                                <Route path="/Dino" element={<WongDinoGame />} />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </div>
        </Auth0Provider>
    );
}

export default App;
