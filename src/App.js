// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload. Alison 
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

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
