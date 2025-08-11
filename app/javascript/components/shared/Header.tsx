import React from 'react';
import { Link } from 'react-router-dom';
import appleStyles from '../../styles/appleStyles';

const Header: React.FC = () => {
    return (
        <header style={{
            backgroundColor: appleStyles.colors.background,
            borderBottom: `1px solid ${appleStyles.colors.border}`,
            padding: '16px 0',
            fontFamily: appleStyles.fonts.primary
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                <Link to="/" style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: appleStyles.colors.text,
                    textDecoration: 'none',
                    letterSpacing: '-0.5px'
                }}>
                    Parrot Whisperer
                </Link>
            </div>
        </header>
    );
};

export default Header;