// PartiesList.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import GameBoard from "./GameBoard";

/**
 * PartiesList component manages the list of game parties and the active game state.
 * 
 * @component
 * @example
 * return (
 *   <PartiesList />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @description
 * - Uses socket.io to communicate with the server for game party updates.
 * - Allows users to create, join, and start game parties.
 * - Displays the list of available game parties and the active game board.
 * - Handles game state updates and displays the winner when a game is finished.
 * 
 * @function creerNouvellePartie
 * Prompts the user to enter a new game party name and emits a socket event to create it.
 * 
 * @function rejoindrePartie
 * @param {string} idPartie - The ID of the game party to join.
 * Emits a socket event to join the specified game party.
 * 
 * @function demarrerPartie
 * @param {string} idPartie - The ID of the game party to start.
 * Emits a socket event to start the specified game party.
 * 
 * @function quitterPartie
 * Resets the active game state and the winner state.
 * 
 * @hook useEffect
 * Sets up socket event listeners for game party updates and cleans them up on component unmount.
 */
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
