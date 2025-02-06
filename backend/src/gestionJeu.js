/**
 * Class representing the game management.
 */
class GestionJeu {
  /**
   * Create a game management instance.
   */
  constructor() {
    this.parties = {};
  }

  /**
   * Get a summary of ongoing games.
   * @returns {Array<Object>} An array of objects containing game IDs, status, and number of players.
   */
  obtenirPartiesEnCours() {}

  /**
   * Create a new game and automatically add the host as a player.
   * @param {string} idPartie - The ID of the game.
   * @param {string} hoteName - The name of the host.
   */
  creerPartie(idPartie, hoteName) {}

  /**
   * Allow a player to join a game.
   * @param {string} idPartie - The ID of the game.
   * @param {string} joueurName - The name of the player.
   * @param {string} socketId - The socket ID of the player.
   */
  rejoindrePartie(idPartie, joueurName, socketId) {}

  /**
   * Simulate rolling a specified number of dice.
   * @param {number} nombre - The number of dice to roll.
   * @returns {Array<number>} An array of dice values.
   */
  lancerDes(nombre) {}

  /**
   * Get the dice of a specified player in a game.
   * @param {string} idPartie - The ID of the game.
   * @param {string} joueurName - The name of the player.
   * @returns {Array<number>} An array of dice values.
   */
  obtenirDesJoueur(idPartie, joueurName) {}

  /**
   * Start a game: check that there are at least 2 players, distribute dice, and assign the turn.
   * @param {string} idPartie - The ID of the game.
   * @returns {boolean} Returns true if the game is successfully started, otherwise false.
   */
  demarrerPartie(idPartie) {}

  /**
   * Distribute new dice to each player (5 dice each).
   * @param {string} idPartie - The ID of the game.
   */
  distribuerDes(idPartie) {}

  /**
   * Place a bet in the specified game.
   * @param {string} idPartie - The ID of the game.
   * @param {string} joueur - The player making the bet.
   * @param {number} valeur - The value of the dice being bet.
   * @param {number} quantite - The quantity of dice being bet.
   * @returns {boolean} Returns true if the bet is successfully placed, otherwise false.
   */
  fairePari(idPartie, joueur, valeur, quantite) {}

  /**
   * Doubt (call "liar").
   * Count the total dice with the bet value and decide who loses a die.
   * @param {string} idPartie - The ID of the game.
   * @param {string} joueur - The player doubting the bet.
   * @returns {string|null} Returns the winner if the game is over, otherwise null.
   */
  douter(idPartie, joueur) {}

  /**
   * Remove a die from the player; if they have only one die left, they are eliminated from the game.
   * @param {string} idPartie - The ID of the game.
   * @param {string} joueur - The player losing a die.
   */
  eliminerJoueur(idPartie, joueur) {}

  /**
   * Check if the game is over (only one player remains).
   * If so, return the winner and delete the game.
   * @param {string} idPartie - The ID of the game.
   * @returns {string|null} Returns the winner if the game is over, otherwise null.
   */
  verifierFinPartie(idPartie) {}

  /**
   * Change the turn to the next player.
   * If the currently identified player no longer exists, take the first one in the list.
   * @param {string} idPartie - The ID of the game.
   */
  changerTour(idPartie) {}

  /**
   * Return the complete game object with the added "id" property.
   * @param {string} idPartie - The ID of the game.
   * @returns {Object|null} The game object with the added "id" property, or null if not found.
   */
  obtenirPartie(idPartie) {}
}
