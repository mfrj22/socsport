// import React, { useEffect, useState } from 'react';

// function HistoriqueReservation({ updateNotificationCount }) {
//   const [evenements, setEvenements] = useState([]);
  
//   useEffect(() => {
//     // Récupérer le nom d'utilisateur depuis le localStorage
//     const username = localStorage.getItem('username');

//     if (username) {
//       // Appeler la fonction pour récupérer l'historique en fonction du nom d'utilisateur
//       fetchHistorique(username);
//     }
//   }, []);

//   // Fonction pour effectuer la requête API pour récupérer l'historique en fonction du nom d'utilisateur
//   const fetchHistorique = async (username) => {
//     try {
//       const response = await fetch(`'http://localhost:5000/historique-reservations/${username}`);
//       if (response.ok) {
//         const historiqueData = await response.json();
//         // Filtrer les événements distincts et avec une date dans la semaine à venir
//         const filteredEvenements = filterEvenements(historiqueData);
//         setEvenements(filteredEvenements);
//       } else {
//         console.error('Erreur lors de la récupération de l\'historique');
//       }
//     } catch (error) {
//       console.error('Erreur réseau', error);
//     }
//   };

//   // Fonction pour filtrer les événements distincts et avec une date dans la semaine à venir
//   const filterEvenements = (evenements) => {
//     const filtered = [];
//     const uniqueIds = new Set();

//     const currentDate = new Date();
//     const passedDate = new Date();
//     passedDate.setDate(currentDate.getDate() - 1);
//     console.log('passedDate', passedDate);

//     evenements.forEach((evenement) => {
//         // Vérifier si l'événement a une date dans la semaine à venir
//         console.log('evenement.date', evenement.date)
//         const eventDate = new Date(evenement.date);
//         if (eventDate <= passedDate) {
//             // Vérifier si l'ID de l'événement est unique
//             if (!uniqueIds.has(evenement.id)) {
//             uniqueIds.add(evenement.id);
//             filtered.push(evenement);
//             }
//         }
//         });
        
//     // const oneWeekFromNow = new Date();
//     // oneWeekFromNow.setDate(currentDate.getDate() + 7);

//     // evenements.forEach((evenement) => {
//     //   // Vérifier si l'événement a une date dans la semaine à venir
//     //   console.log('evenement.date', evenement.date)
//     //   const eventDate = new Date(evenement.date);
//     //   if (eventDate <= oneWeekFromNow && eventDate >= currentDate) {
//     //     // Vérifier si l'ID de l'événement est unique
//     //     if (!uniqueIds.has(evenement.id)) {
//     //       uniqueIds.add(evenement.id);
//     //       filtered.push(evenement);
//     //     }
//     //   }
//     // });

//     return filtered;
//   };

//   return (
//     <div className="historiques-container">
//       <h2>Historique</h2>
//       {evenements.length > 0 ? (
//         <table className="historiques-table">
//           <thead>
//             <tr>
//               <th>Nom</th>
//               <th>Date</th>
//               <th>Heure de début</th>
//               <th>Heure de fin</th>
//             </tr>
//           </thead>
//           <tbody>
//             {evenements.map((evenement) => (
//               <tr key={evenement.id} className="historiques-item">
//                 <td>{evenement.nom}</td>
//                 <td>{evenement.date}</td>
//                 <td>{evenement.heure_debut}</td>
//                 <td>{evenement.heure_fin}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Vous n'êtes inscrit à aucun événement correspondant à vos critères.</p>
//       )}
//     </div>
//   );
// };

// export default HistoriqueReservation;
import React, { useEffect, useState } from 'react';

function HistoriqueReservation({ updateNotificationCount }) {
  const [evenements, setEvenements] = useState([]);
  
  useEffect(() => {
    // Récupérer le nom d'utilisateur depuis le localStorage
    const username = localStorage.getItem('username');

    if (username) {
      // Appeler la fonction pour récupérer l'historique en fonction du nom d'utilisateur
      fetchHistorique(username);
    }
  }, []);

  // Fonction pour effectuer la requête API pour récupérer l'historique en fonction du nom d'utilisateur
  const fetchHistorique = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/historique/${username}`);
      if (response.ok) {
        const historiqueData = await response.json();
        // Filtrer les événements distincts et avec une date dans la semaine à venir
        const filteredEvenements = filterEvenements(historiqueData);
        setEvenements(filteredEvenements);
      } else {
        console.error('Erreur lors de la récupération de l\'historique');
      }
    } catch (error) {
      console.error('Erreur réseau', error);
    }
  };

  // Fonction pour filtrer les événements distincts et avec une date dans la semaine à venir
  const filterEvenements = (evenements) => {
    const filtered = [];
    const uniqueIds = new Set();

    const currentDate = new Date();
    const passedDate = new Date();
    passedDate.setDate(currentDate.getDate() - 1);
    console.log('passedDate', passedDate);

    evenements.forEach((evenement) => {
      // Vérifier si l'événement a une date dans la semaine à venir
      console.log('evenement.date', evenement.date)
      const eventDate = new Date(evenement.date);
      if (eventDate <= passedDate) {
        // Vérifier si l'ID de l'événement est unique
        if (!uniqueIds.has(evenement.id)) {
          uniqueIds.add(evenement.id);
          filtered.push(evenement);
        }
      }
    });

    // const oneWeekFromNow = new Date();
    // oneWeekFromNow.setDate(currentDate.getDate() + 7);

    // evenements.forEach((evenement) => {
    //   // Vérifier si l'événement a une date dans la semaine à venir
    //   console.log('evenement.date', evenement.date)
    //   const eventDate = new Date(evenement.date);
    //   if (eventDate <= oneWeekFromNow && eventDate >= currentDate) {
    //     // Vérifier si l'ID de l'événement est unique
    //     if (!uniqueIds.has(evenement.id)) {
    //       uniqueIds.add(evenement.id);
    //       filtered.push(evenement);
    //     }
    //   }
    // });

    return filtered;
  };

  return (
    <div className="historiques-container">
      <h2>Historique</h2>
      {evenements.length > 0 ? (
        <table className="historiques-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date</th>
              <th>Heure de début</th>
              <th>Heure de fin</th>
            </tr>
          </thead>
          <tbody>
            {evenements.map((evenement) => (
              <tr key={evenement.id} className="historiques-item">
                <td>{evenement.nom}</td>
                <td>{evenement.date}</td>
                <td>{evenement.heure_debut}</td>
                <td>{evenement.heure_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Vous n'êtes inscrit à aucun événement correspondant à vos critères.</p>
      )}
    </div>
  );
}

export default HistoriqueReservation;
