// GameBoard.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const GameBoard = ({ partieActive, quitterPartie }) => {
  // Guard clause: si partieActive es undefined, mostramos "Chargement..."
  if (!partieActive) {
    return <div>Chargement...</div>;
  }

  const [monTour, setMonTour] = useState(false);
  const [dernierPari, setDernierPari] = useState(null);
  const [desJoueur, setDesJoueur] = useState([]);
  const [valeur, setValeur] = useState("");
  const [quantite, setQuantite] = useState("");

  console.log("🟢 GameBoard monté. Partie active:", partieActive);
  console.log("🟢 Socket ID:", socket.id);

  useEffect(() => {
    if (!partieActive) return;

    console.log(
      "⚙️ Mise à jour immédiate: tourActuel:",
      partieActive.tourActuel,
      "| socket.id:",
      socket.id
    );
    setMonTour(partieActive.tourActuel === socket.id);
    setDernierPari(partieActive.dernierPari || null);

    const handleMajPartie = (partie) => {
      console.log("📡 'majPartie' reçu:", partie);
      console.log(
        "🔎 Comparaison: partie.tourActuel =", partie.tourActuel,
        "| socket.id =", socket.id
      );
      if (partie) {
        setMonTour(partie.tourActuel === socket.id);
        setDernierPari(partie.dernierPari || null);
      }
    };

    const handleMiseAJourDes = (des) => {
      console.log("🎲 'miseAJourDes' reçu pour", socket.id, ":", des);
      if (Array.isArray(des) && des.length > 0) {
        setDesJoueur([...des]);
      } else {
        console.warn("⚠️ Avertissement: Array de dés vide ou invalide.", des);
      }
    };

    socket.on("majPartie", handleMajPartie);
    socket.on("miseAJourDes", handleMiseAJourDes);

    return () => {
      socket.off("majPartie", handleMajPartie);
      socket.off("miseAJourDes", handleMiseAJourDes);
    };
  }, [partieActive]);

  const handleFairePari = (e) => {
    e.preventDefault();
    const intValeur = parseInt(valeur, 10);
    const intQuantite = parseInt(quantite, 10);

    console.log("Envoi de la mise pour la partie:", partieActive && partieActive.id);

    if (intValeur >= 1 && intValeur <= 6 && intQuantite > 0) {
      socket.emit("fairePari", {
        idPartie: partieActive.id, // Debe estar definido
        joueur: socket.id,
        valeur: intValeur,
        quantite: intQuantite,
      });
      setValeur("");
      setQuantite("");
    } else {
      console.error("❌ Valeur ou quantité invalide:", valeur, quantite);
    }
  };

  const handleDouter = () => {
    console.log("🤨 Envoi de 'douter' par", socket.id);
    socket.emit("douter", partieActive.id, socket.id);
  };

  return (
    <div>
      <h2>🎲 Partie {partieActive.id} en cours</h2>
      <p>{monTour ? "✅ C'est votre tour !" : "⏳ En attente du tour..."}</p>

      {dernierPari ? (
        <p>
          📢 Dernière mise : {dernierPari.joueur} a parié {dernierPari.quantite} dés de valeur {dernierPari.valeur}
        </p>
      ) : (
        <p>📢 Aucune mise encore.</p>
      )}

      <p>
        🎲 <strong>Vos dés :</strong>{" "}
        {desJoueur.length > 0 ? desJoueur.join(", ") : "❌ Dés non reçus, en attente..."}
      </p>

      {monTour && (
        <div>
          <form onSubmit={handleFairePari}>
            <div>
              <label>
                Valeur (1-6):{" "}
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={valeur}
                  onChange={(e) => setValeur(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Quantité:{" "}
                <input
                  type="number"
                  min="1"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  required
                />
              </label>
            </div>
            <button type="submit">Faire une mise</button>
          </form>
          {dernierPari && <button onClick={handleDouter}>Douter</button>}
        </div>
      )}

      <button onClick={quitterPartie}>Quitter la partie</button>
    </div>
  );
};

export default GameBoard;
