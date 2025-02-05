class GestionJeu {
    constructor() {
      this.parties = {};
    }
  
    creerPartie(idPartie, hote) {
      if (!this.parties[idPartie]) {
        this.parties[idPartie] = {
          hote,
          joueurs: {},
          tourActuel: null,
          des: {},
        };
        console.log(`Nouvelle partie créée : ${idPartie}`);
      }
    }
  
    rejoindrePartie(idPartie, idJoueur) {
      if (this.parties[idPartie]) {
        this.parties[idPartie].joueurs[idJoueur] = {
          des: this.lancerDes(),
          sonTour: false,
        };
        console.log(`Joueur ${idJoueur} a rejoint la partie ${idPartie}`);
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
          console.log(`La partie ${idPartie} commence. Premier tour : ${joueurs[0]}`);
        }
      }
    }
  
    obtenirPartie(idPartie) {
      return this.parties[idPartie];
    }
  }
  
  module.exports = new GestionJeu();
  