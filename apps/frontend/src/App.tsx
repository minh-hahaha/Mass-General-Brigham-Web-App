import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ExamplePage from './routes/ExamplePage.tsx';
import LogoBar from "./components/LogoBar.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            errorElement: <div />,
            element: <LogoBar />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
