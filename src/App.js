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

import React, { Component } from 'react';

class App extends Component {
  state = {
    resultatDuCalcul: null,
  };

  effectuerCalcul = () => {
    fetch('/calcul')  // Assurez-vous que l'URL correspond à votre route Flask
      .then((response) => response.json())
      .then((data) => {
        this.setState({ resultatDuCalcul: data.resultat });
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.effectuerCalcul}>Effectuer le calcul</button>
        <p>Résultat du calcul : {this.state.resultatDuCalcul}</p>
      </div>
    );
  }
}

export default App;

