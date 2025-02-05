// gameLogic.ts

/**
 * Function to roll a die and return a random number between 1 and 6.
 */
export function rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
}

/**
 * Function to roll multiple dice.
 * @param numberOfDice - The number of dice to roll.
 * @returns An array of rolled dice values.
 */
export function rollDice(numberOfDice: number): number[] {
    const diceRolls: number[] = [];
    for (let i = 0; i < numberOfDice; i++) {
        diceRolls.push(rollDie());
    }
    return diceRolls;
}

/**
 * Function to count the occurrences of each die face in a given array of dice rolls.
 * @param diceRolls - An array of rolled dice values.
 * @returns An object with the count of each die face.
 */
export function countDiceFaces(diceRolls: number[]): Record<number, number> {
    const faceCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (const roll of diceRolls) {
        faceCounts[roll]++;
    }
    return faceCounts;
}

/**
 * Function to determine if a bid is valid based on the current state of the game.
 * @param currentBid - The current bid in the format [face, quantity].
 * @param newBid - The new bid in the format [face, quantity].
 * @returns True if the new bid is valid, false otherwise.
 */
export function isValidBid(currentBid: [number, number], newBid: [number, number]): boolean {
    const [currentFace, currentQuantity] = currentBid;
    const [newFace, newQuantity] = newBid;

    if (newQuantity > currentQuantity) {
        return true;
    } else if (newQuantity === currentQuantity && newFace > currentFace) {
        return true;
    }
    return false;
}