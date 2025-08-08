import React from 'react';
import Header from '../shared/Header';
import { MainLayoutProps } from '../../types';
import appleStyles from '../../styles/appleStyles';

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div style={{
            fontFamily: appleStyles.fonts.primary,
            backgroundColor: appleStyles.colors.background,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Header />
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;