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
              enCours: false,
              dernierPari: null,
          };
          console.log(`📌 Nouvelle partie créée : ${idPartie}`);
      }
  }

  rejoindrePartie(idPartie, idJoueur) {
      if (this.parties[idPartie]) {
          this.parties[idPartie].joueurs[idJoueur] = {
              des: this.lancerDes(5),
          };
          console.log(`👤 Joueur ${idJoueur} a rejoint la partie ${idPartie}`);
      }
  }

  lancerDes(nombre) {
      return Array.from({ length: nombre }, () => Math.floor(Math.random() * 6) + 1);
  }

  demarrerPartie(idPartie) {
      if (this.parties[idPartie]) {
          const joueurs = Object.keys(this.parties[idPartie].joueurs);
          if (joueurs.length > 1) {
              this.parties[idPartie].enCours = true;
              this.parties[idPartie].tourActuel = joueurs[0];
              console.log(`▶️ La partie ${idPartie} commence. Premier tour : ${joueurs[0]}`);
              return true;
          } else {
              console.log(`⛔ Impossible de démarrer la partie ${idPartie}, pas assez de joueurs.`);
              return false;
          }
      }
  }

  fairePari(idPartie, joueur, valeur, quantite) {
      const partie = this.parties[idPartie];
      if (partie && partie.enCours && partie.tourActuel === joueur) {
          partie.dernierPari = { joueur, valeur, quantite };
          console.log(`🎲 Pari: ${joueur} pense qu'il y a ${quantite} dés de valeur ${valeur}`);
          this.changerTour(idPartie);
          return true;
      }
      return false;
  }

  douter(idPartie, joueur) {
      const partie = this.parties[idPartie];
      if (partie && partie.dernierPari) {
          const { valeur, quantite, joueur: parieur } = partie.dernierPari;
          let total = 0;
          for (const j in partie.joueurs) {
              total += partie.joueurs[j].des.filter(d => d === valeur).length;
          }

          if (total >= quantite) {
              console.log(`✔️ Le pari était correct ! ${joueur} perd un dé.`);
              this.eliminerJoueur(idPartie, joueur);
          } else {
              console.log(`❌ Le pari était faux ! ${parieur} perd un dé.`);
              this.eliminerJoueur(idPartie, parieur);
          }

          return true;
      }
      return false;
  }

  eliminerJoueur(idPartie, joueur) {
      if (this.parties[idPartie].joueurs[joueur].des.length > 1) {
          this.parties[idPartie].joueurs[joueur].des.pop();
      } else {
          console.log(`💀 Joueur ${joueur} éliminé !`);
          delete this.parties[idPartie].joueurs[joueur];
      }
  }

  verifierFinPartie(idPartie) {
      const partie = this.parties[idPartie];
      if (!partie) return;
      const joueursRestants = Object.keys(partie.joueurs);

      if (joueursRestants.length === 1) {
          console.log(`🏆 Joueur ${joueursRestants[0]} gagne la partie ${idPartie} !`);
          return joueursRestants[0]; // Retorna el ganador
      }
      return null;
  }

  changerTour(idPartie) {
      const partie = this.parties[idPartie];
      const joueurs = Object.keys(partie.joueurs);
      const indexActuel = joueurs.indexOf(partie.tourActuel);
      partie.tourActuel = joueurs[(indexActuel + 1) % joueurs.length];
  }

  obtenirPartiesEnCours() {
      return Object.keys(this.parties).map(id => ({
          id,
          enCours: this.parties[id].enCours,
          nbJoueurs: Object.keys(this.parties[id].joueurs).length,
      }));
  }

  obtenirPartie(idPartie) {
      return this.parties[idPartie] || null;
  }
}

module.exports = new GestionJeu();
