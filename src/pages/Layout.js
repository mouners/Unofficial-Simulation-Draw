import React, { useState, useEffect } from 'react';
import '../style/Layout.css'; // Your global CSS

const Layout = ({ children }) => {
    const [isLandscape, setIsLandscape] = useState(window.innerHeight < window.innerWidth);

    function handleWindowSizeChange() {
        setIsLandscape(window.innerHeight < window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
    
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const isMobile = window.innerWidth < window.innerHeight ? window.innerWidth <= 678: window.innerHeight <= 678;

    return (
        <div >
            {isMobile && isLandscape && (
                <div className="notice">
                    <div className="notice-content">
                        <p>Please rotate your device to portrait mode.</p>
                    </div>
                </div>
            )}
            {!isLandscape && children} {/* Render the routed content only if not in landscape */}

            {!isMobile && children}
        </div>
    );
};

export default Layout;
