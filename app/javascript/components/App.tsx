import React from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { AppProps } from '../types';

const App: React.FC<AppProps> = () => {
    return (
        <MainLayout>
            <HomePage />
        </MainLayout>
    );
};

export default App;