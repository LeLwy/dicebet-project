class GestionJeu {
  constructor() {
      this.parties = {}; // Stocke les parties en cours
  }

  creerPartie(idPartie, hote) {
      if (!this.parties[idPartie]) {
          this.parties[idPartie] = {
              hote,
              joueurs: {},
              tourActuel: null,
              des: {},
              enCours: false, // Ajout de l'état de la partie
          };
          console.log(`📌 Nouvelle partie créée : ${idPartie}`);
      }
  }

  rejoindrePartie(idPartie, idJoueur) {
      if (this.parties[idPartie]) {
          this.parties[idPartie].joueurs[idJoueur] = {
              des: this.lancerDes(),
              sonTour: false,
          };
          console.log(`👤 Joueur ${idJoueur} a rejoint la partie ${idPartie}`);
      }
  }

  lancerDes() {
      return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
  }

  demarrerPartie(idPartie) {
      if (this.parties[idPartie]) {
          const joueurs = Object.keys(this.parties[idPartie].joueurs);
          if (joueurs.length > 1) {
              this.parties[idPartie].tourActuel = joueurs[0];
              this.parties[idPartie].enCours = true; // Mettre la partie en état "en cours"
              console.log(`▶️ La partie ${idPartie} commence. Premier tour : ${joueurs[0]}`);
          } else {
              console.log(`⛔ Impossible de démarrer la partie ${idPartie}, pas assez de joueurs.`);
          }
      }
  }

  obtenirPartie(idPartie) {
      return this.parties[idPartie];
  }

  /**
   * 🔥 Fonction pour obtenir toutes les parties en cours 🔥
   */
  obtenirPartiesEnCours() {
      return Object.keys(this.parties).map(id => ({
          id,
          enCours: this.parties[id].enCours,
          nbJoueurs: Object.keys(this.parties[id].joueurs).length,
      }));
  }
}

module.exports = new GestionJeu();
