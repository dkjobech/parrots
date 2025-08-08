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
                    Parrots
                </Link>
                <nav style={{
                    display: 'flex',
                    gap: '24px'
                }}>
                    <Link to="/" style={{
                        color: appleStyles.colors.primary,
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 500
                    }}>
                        Home
                    </Link>
                    <Link to="/details" style={{
                        color: appleStyles.colors.lightText,
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 500,
                        transition: 'color 0.2s ease'
                    }}>
                        Details
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;