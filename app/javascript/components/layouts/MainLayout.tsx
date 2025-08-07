import React from 'react';
import Header from '../shared/Header';
import { MainLayoutProps } from '../../types';

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;