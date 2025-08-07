import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">
                    Parrots
                </a>
                <nav className="navbar-nav">
                    <a className="nav-link" href="/">Home</a>
                    {/* Add more navigation items as needed */}
                </nav>
            </div>
        </header>
    );
};

export default Header;