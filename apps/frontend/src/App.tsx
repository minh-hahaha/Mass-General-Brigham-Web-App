import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChestnutHillDirectory from './routes/ChestnutHillDirectory.tsx';

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChestnutHillDirectory />} />
            </Routes>
        </BrowserRouter>
    )

}



export default App;
