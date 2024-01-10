// Exemple de composant React pour le formulaire de login
import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Envoyer la requête au backend pour vérifier le nom d'utilisateur
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    console.log(data); // Faire quelque chose avec la réponse du serveur
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default LoginForm;
