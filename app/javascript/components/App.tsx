import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import { AppProps } from '../types';

const App: React.FC<AppProps> = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/details" element={<DetailsPage />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;