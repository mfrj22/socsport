import React, { useState } from 'react';

function App() {
    const [resultat, setResultat] = useState(null);

    const handleCalculClick = async () => {
        const response = await fetch('http://localhost:5000/calcul');
        const data = await response.json();
        setResultat(data.resultat);
    };

    return (
        <div>
            <button onClick={handleCalculClick}>Calculer</button>
            {resultat && <p>Résultat : {resultat}</p>}
        </div>
    );
}

export default App;
