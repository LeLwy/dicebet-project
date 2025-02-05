import React, { useEffect, useState } from "react";
import { socket } from "../socket"; // Importamos el socket desde un archivo global

const PartiesList = () => {
    const [parties, setParties] = useState([]);

    useEffect(() => {
        socket.emit("obtenirParties"); // Solicita la lista de partidas

        socket.on("listeParties", (parties) => {
            setParties(parties);
        });

        return () => {
            socket.off("listeParties"); // Limpia el evento al desmontar
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

    return (
        <div>
            <h2>🎲 Liste des Parties</h2>
            <button onClick={creerNouvellePartie}>Créer une Partie</button>
            <ul>
                {parties.length === 0 ? (
                    <p>Aucune partie en cours.</p>
                ) : (
                    parties.map((partie) => (
                        <li key={partie.id}>
                            Partie: {partie.id} | Joueurs: {partie.nbJoueurs} | 
                            {partie.enCours ? " En cours ⏳" : " En attente ⏳"}
                            <button onClick={() => rejoindrePartie(partie.id)}>
                                Rejoindre
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default PartiesList;
