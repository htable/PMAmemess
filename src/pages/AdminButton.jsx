import React, { useState, useEffect, useRef } from 'react';
import './AdminButton.css';
import AdminBoard from './AdminBoard';

const AdminButton = ({ children, additionalComponent: AdditionalComponent }) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const loginFormRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginFormRef.current && !loginFormRef.current.contains(event.target)) {
                setShowLoginForm(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        // Perform authentication logic here
        if (username === 'adminpma' && password === 'AdminPMA123$') {
            setIsLoggedIn(true);
            setShowLoginForm(false);
        } else {
            alert('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div>
            {!isLoggedIn && (
                <button id='LoginBtn' onClick={() => setShowLoginForm(true)}></button>
            )}

            {showLoginForm && !isLoggedIn && (
                <div id="login-form" ref={loginFormRef}>
                    <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}

            {isLoggedIn && (
                <div>
                    <AdminBoard handleLogout={handleLogout} /> {/* Pass logout function as prop */}
                </div>
            )}

            {AdditionalComponent && <AdditionalComponent />} {/* Render the additional component if provided */}
            {children}
        </div>
    );
};

export default AdminButton;
