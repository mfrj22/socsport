import React, { useState, useEffect } from 'react';

const LoginForm = ({ isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedUsername && storedIsAuthenticated) {
      setUsername(storedUsername);
      setIsAuthenticated(storedIsAuthenticated === 'true');
    }
  }, [setIsAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    setIsAuthenticated(true);
    localStorage.setItem('username', username);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bienvenue, {username}!</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin}>
            <label>
              Nom d'utilisateur:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <button type="submit">Connexion</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
