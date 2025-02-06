// gestionJeu.js
class GestionJeu {
  constructor() {
    this.parties = {};
  }

  // Retorna un resumen de las partidas en curso.
  obtenirPartiesEnCours() {
    return Object.keys(this.parties).map((id) => ({
      id, // se incluye el id de la partida
      enCours: this.parties[id].enCours,
      nbJoueurs: Object.keys(this.parties[id].joueurs).length,
    }));
  }

  // Al crear la partida, se añade automáticamente el host como jugador.
  creerPartie(idPartie, hoteName) {
    if (!this.parties[idPartie]) {
      this.parties[idPartie] = {
        hote: hoteName,
        joueurs: {},
        tourActuel: null,
        enCours: false,
        dernierPari: null,
      };
      // Agregar al host automáticamente.
      this.rejoindrePartie(idPartie, hoteName, hoteName);
      console.log(`Partie ${idPartie} créée et rejointe par ${hoteName}`);
    } else {
      console.warn(`La partie ${idPartie} existe déjà.`);
    }
  }

  // Permite que un jugador se una a la partida.
  rejoindrePartie(idPartie, joueurName, socketId) {
    const partie = this.parties[idPartie];
    if (partie) {
      partie.joueurs[joueurName] = {
        socketId,
        des: this.lancerDes(5),
      };
      console.log(
        `👤 Joueur ${joueurName} (socket: ${socketId}) a rejoint la partie ${idPartie}`
      );
    } else {
      console.error(`La partie ${idPartie} n'existe pas.`);
    }
  }

  // Simula el lanzamiento de "nombre" dados (valores entre 1 y 6).
  lancerDes(nombre) {
    return Array.from({ length: nombre }, () => Math.floor(Math.random() * 6) + 1);
  }

  // Retorna los dados del jugador indicado en la partida.
  obtenirDesJoueur(idPartie, joueurName) {
    const partie = this.parties[idPartie];
    if (!partie) {
      console.error(`La partie ${idPartie} n'existe pas.`);
      return [];
    }
    const joueur = partie.joueurs[joueurName];
    if (!joueur) {
      console.error(`Le joueur ${joueurName} n'est pas dans la partie ${idPartie}`);
      return [];
    }
    return joueur.des || [];
  }

  // Inicia la partida: verifica que haya al menos 2 jugadores, distribuye los dados y asigna el turno.
  demarrerPartie(idPartie) {
    const partie = this.parties[idPartie];
    if (!partie) {
      console.error(`La partie ${idPartie} n'existe pas.`);
      return false;
    }
    const joueurs = Object.keys(partie.joueurs);
    if (joueurs.length < 2) {
      console.log(`⛔ Pas assez de joueurs pour démarrer la partie ${idPartie}.`);
      return false;
    }
    partie.enCours = true;
    // Se asigna el turno al primer jugador.
    partie.tourActuel = joueurs[0];
    this.distribuerDes(idPartie);
    console.log(`▶️ La partie ${idPartie} commence. Premier tour: ${partie.tourActuel}`);
    return true;
  }

  // Reparte nuevos dados a cada jugador (se asignan 5 dados a cada uno).
  distribuerDes(idPartie) {
    const partie = this.parties[idPartie];
    if (!partie) {
      console.error(`La partie ${idPartie} n'existe pas.`);
      return;
    }
    console.log(`🎲 Distribution des dés pour la partie ${idPartie}`);
    Object.keys(partie.joueurs).forEach((joueurName) => {
      partie.joueurs[joueurName].des = this.lancerDes(5);
      console.log(`🎲 Dés pour ${joueurName}:`, partie.joueurs[joueurName].des);
    });
  }

  /**
   * Faire une mise (realizar una apuesta).
   * Si ya existe una apuesta, la nueva debe ser estrictamente superior:
   * - O bien mayor en cantidad,
   * - O bien, si la cantidad es igual, mayor en valor.
   */
  fairePari(idPartie, joueur, valeur, quantite) {
    if (!this.parties.hasOwnProperty(idPartie)) {
      console.error(`La partie ${idPartie} n'existe pas.`);
      return false;
    }
    const partie = this.parties[idPartie];

    // Si tourActuel no está definido, lo reestablecemos al primer jugador disponible.
    if (typeof partie.tourActuel === "undefined" || partie.tourActuel === null) {
      const joueurs = Object.keys(partie.joueurs);
      partie.tourActuel = joueurs.length > 0 ? joueurs[0] : null;
    }

    console.log("Tentative de mise par:", joueur, "| Tour actuel:", partie.tourActuel || "inexistant");

    if (partie.enCours && partie.tourActuel === joueur) {
      if (partie.dernierPari) {
        const { valeur: ancienneValeur, quantite: ancienneQuantite } = partie.dernierPari;
        if (quantite < ancienneQuantite || (quantite === ancienneQuantite && valeur <= ancienneValeur)) {
          console.error("La nouvelle mise doit être supérieure à la précédente.");
          return false;
        }
      }
      partie.dernierPari = { joueur, valeur, quantite };
      console.log(`🎲 Le joueur ${joueur} parie ${quantite} dés de valeur ${valeur}`);
      this.changerTour(idPartie);
      return true;
    }
    console.error("Mise non valide ou ce n'est pas votre tour.");
    return false;
  }

  /**
   * Douter (llamar "mentiroso").
   * Se cuenta el total de dados con el valor apostado y se decide quién pierde un dado.
   */
  douter(idPartie, joueur) {
    const partie = this.parties[idPartie];
    if (!partie || !partie.dernierPari) {
      console.error("Aucune mise en cours pour douter.");
      return false;
    }
    const { valeur, quantite, joueur: parieur } = partie.dernierPari;
    let total = 0;
    for (const j in partie.joueurs) {
      total += partie.joueurs[j].des.filter((d) => d === valeur).length;
    }
    console.log(`Total de dés de valeur ${valeur} dans la partie ${idPartie}: ${total}`);

    let perdant;
    if (total >= quantite) {
      console.log(`✔️ La mise était correcte ! Le joueur ${joueur} (celui qui doute) perd un dé.`);
      perdant = joueur; // Celui qui doute perd un dé.
    } else {
      console.log(`❌ La mise était fausse ! Le joueur ${parieur} (celui qui a parié) perd un dé.`);
      perdant = parieur;
    }
    this.eliminerJoueur(idPartie, perdant);

    // Vérifier si la partie est terminée.
    const gagnant = this.verifierFinPartie(idPartie);
    if (gagnant) return gagnant;

    // Réinitialiser la mise et changer de tour.
    partie.dernierPari = null;
    this.changerTour(idPartie);
    return null;
  }

  /**
   * Enlève un dé au joueur; s'il n'a plus qu'un dé, il est éliminé de la partie.
   */
  eliminerJoueur(idPartie, joueur) {
    const partie = this.parties[idPartie];
    if (!partie || !partie.joueurs[joueur]) {
      console.error(`Le joueur ${joueur} n'existe pas dans la partie ${idPartie}`);
      return;
    }
    if (partie.joueurs[joueur].des.length > 1) {
      partie.joueurs[joueur].des.pop();
      console.log(`Le joueur ${joueur} perd un dé, il lui reste ${partie.joueurs[joueur].des.length} dés.`);
    } else {
      console.log(`Le joueur ${joueur} est éliminé de la partie ${idPartie}.`);
      delete partie.joueurs[joueur];
    }
  }

  /**
   * Vérifie si la partie est terminée (il ne reste qu'un joueur).
   * Dans ce cas, renvoie le gagnant et supprime la partie.
   */
  verifierFinPartie(idPartie) {
    const partie = this.parties[idPartie];
    if (!partie) return null;
    const joueursRestants = Object.keys(partie.joueurs);
    if (joueursRestants.length === 1) {
      const gagnant = joueursRestants[0];
      console.log(`🏆 La partie ${idPartie} est terminée. Gagnant: ${gagnant}`);
      delete this.parties[idPartie];
      return gagnant;
    }
    return null;
  }

  /**
   * Change le tour au joueur suivant.
   * Si le joueur actuellement identifié n'existe plus, on prend le premier de la liste.
   */
  changerTour(idPartie) {
    const partie = this.parties[idPartie];
    if (!partie) return;
    const joueurs = Object.keys(partie.joueurs);
    if (joueurs.length === 0) {
      partie.tourActuel = null;
      console.error("Aucun joueur dans la partie.");
      return;
    }
    const indexActuel = joueurs.indexOf(partie.tourActuel);
    if (indexActuel === -1) {
      partie.tourActuel = joueurs[0];
    } else {
      partie.tourActuel = joueurs[(indexActuel + 1) % joueurs.length];
    }
    console.log(`Tour changé. Nouveau tour: ${partie.tourActuel}`);
  }

  // Retourne l'objet complet de la partie en y ajoutant la propriété "id".
  obtenirPartie(idPartie) {
    const partie = this.parties[idPartie];
    if (!partie) {
      console.error(`❌ ERREUR: Partie ${idPartie} non trouvée`);
      return null;
    }
    return { id: idPartie, ...partie };
  }
}

module.exports = new GestionJeu();
