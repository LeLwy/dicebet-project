// PartiesList.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import GameBoard from "./GameBoard";

const PartiesList = () => {
  const [parties, setParties] = useState([]);
  const [partieActive, setPartieActive] = useState(null);
  const [gagnant, setGagnant] = useState(null);

  useEffect(() => {
    socket.emit("obtenirParties");

    socket.on("listeParties", (parties) => {
      setParties(parties);
    });

    socket.on("majPartie", (partie) => {
      console.log("📡 Mise à jour de la partie reçue :", partie);
      setPartieActive(partie);
    });

    socket.on("partieTerminee", ({ gagnant }) => {
      setGagnant(gagnant);
      setPartieActive(null);
    });

    return () => {
      socket.off("listeParties");
      socket.off("majPartie");
      socket.off("partieTerminee");
    };
  }, []);

  const creerNouvellePartie = () => {
    const idPartie = prompt("Nom de la partie :");
    if (idPartie) {
      socket.emit("creerPartie", idPartie);
    }
  };

  const rejoindrePartie = (idPartie) => {
    socket.emit("rejoindrePartie", idPartie);
  };

  const demarrerPartie = (idPartie) => {
    console.log(`🚀 Envoi de "demarrerPartie" pour ${idPartie}`);
    socket.emit("demarrerPartie", idPartie);
  };

  const quitterPartie = () => {
    setPartieActive(null);
    setGagnant(null);
  };

  return (
    <div>
      {partieActive ? (
        <>
          <h2>🎲 Partie en cours</h2>
          <GameBoard partieActive={partieActive} quitterPartie={quitterPartie} />
        </>
      ) : (
        <>
          <h2>🎲 Liste des Parties</h2>
          <button onClick={creerNouvellePartie}>Créer une Partie</button>
          <ul>
            {parties.length === 0 ? (
              <p>Aucune partie en cours.</p>
            ) : (
              parties.map((partie) => (
                <li key={partie.id}>
                  Partie: {partie.id} | Joueurs: {partie.nbJoueurs} |{" "}
                  {partie.enCours ? " En cours ⏳" : " En attente ⏳"}
                  <button onClick={() => rejoindrePartie(partie.id)}>Rejoindre</button>
                  {!partie.enCours && (
                    <button onClick={() => demarrerPartie(partie.id)}>Démarrer</button>
                  )}
                </li>
              ))
            )}
          </ul>
        </>
      )}

      {gagnant && <h2>🏆 Partie terminée ! Gagnant: {gagnant}</h2>}
    </div>
  );
};

export default PartiesList;
