import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginPage from './routes/LoginPage.tsx';
import HomePage from './routes/HomePage';
import ExamplePage from "./routes/ExamplePage.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            errorElement: <div />,
            element: <ExamplePage />,
        },
        {
            path: '/login',
            errorElement: <div />,
            element: <LoginPage />,
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
