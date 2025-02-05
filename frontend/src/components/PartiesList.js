import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const PartiesList = () => {
    const [parties, setParties] = useState([]);
    const [partieActive, setPartieActive] = useState(null);
    const [monTour, setMonTour] = useState(false);
    const [dernierPari, setDernierPari] = useState(null);
    const [gagnant, setGagnant] = useState(null);

    useEffect(() => {
        socket.emit("obtenirParties");

        socket.on("listeParties", (parties) => {
            setParties(parties);
        });

        socket.on("majPartie", (partie) => {
            setPartieActive(partie);
            setMonTour(partie.tourActuel === socket.id);
            setDernierPari(partie.dernierPari);
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
        socket.emit("demarrerPartie", idPartie);
    };

    const fairePari = () => {
        const valeur = parseInt(prompt("Choisissez une valeur de dé (1-6):"), 10);
        const quantite = parseInt(prompt("Nombre de dés pour cette valeur:"), 10);
        if (valeur >= 1 && valeur <= 6 && quantite > 0) {
            socket.emit("fairePari", { idPartie: partieActive.id, joueur: socket.id, valeur, quantite });
        }
    };

    const douter = () => {
        socket.emit("douter", partieActive.id, socket.id);
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
                            <button onClick={() => rejoindrePartie(partie.id)}>Rejoindre</button>
                            {!partie.enCours && <button onClick={() => demarrerPartie(partie.id)}>Démarrer</button>}
                        </li>
                    ))
                )}
            </ul>

            {partieActive && (
                <div>
                    <h3>🎲 Partie {partieActive.id} en cours</h3>
                    <p>{monTour ? "✅ C'est votre tour !" : "⏳ En attente du tour..."}</p>
                    {dernierPari && (
                        <p>📢 Dernière mise: {dernierPari.quantite} dés de valeur {dernierPari.valeur}</p>
                    )}
                    {monTour && (
                        <div>
                            <button onClick={fairePari}>Faire une mise</button>
                            <button onClick={douter}>Douter</button>
                        </div>
                    )}
                </div>
            )}

            {gagnant && <h2>🏆 Partie terminée ! Gagnant: {gagnant}</h2>}
        </div>
    );
};

export default PartiesList;
