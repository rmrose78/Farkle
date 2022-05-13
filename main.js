// --- DOM Elements --- \\
const valuePlayer_1 = document.getElementById("player1-score--value");
const valuePlayer_2 = document.getElementById("player2-score--value");
const dicePositions = document.getElementsByClassName("dice");
const uncommitedPoints = document.getElementById("currentPoints");

// --- Roll Dice --- \\

// Dice Values array and boolean array on wether a dice at that position should be rolled.
const dice = {
    positionValues: [0, 0, 0, 0, 0, 0],
    rollBoolean: [true, true, true, true, true, true],
};

// Roll Random number between 1-6.
const rollDie = () => Math.floor(Math.random() * 6) + 1;

// Roll each die based on the Boolean array value for that die.
const rollAvailable = () => {
    // dice selected prior to new roll will have rollBoolean as false.
    lockSelectedDiceOnRoll()

    // Roll Dice if position in boolean array is true
    for (let i = 0; i < dice.positionValues.length; i++) {
        if (dice.rollBoolean[i]) dice.positionValues[i] = rollDie();
    }
};

// Display dice - if 0 show blank die else show die image of the value.
const displayDice = () => {
    for (const die in dice.positionValues) {
    dice.positionValues[die] === 0
    ? (dicePositions[die].src = `./images/blank_dice.png`)
    : (dicePositions[die].src = `./images/${dice.positionValues[die]}_dice.png`);
}
};

// dice selected will change rollBoolean to false to prevent rerolling that die.
const lockSelectedDiceOnRoll = () => {
    for (let i = 0; i < dicePositions.length; i++) {
        if (dicePositions[i].classList[1] === "select") dice.rollBoolean[i] = false
    }
    console.log(`boolean ${dice.rollBoolean}`)
}

// --- Select --- \\

// Add event listener on each die.
for (let i = 0; i < dicePositions.length; i++) {
        dicePositions[i].addEventListener("click", () => {
            // toggle Select as long as die is not blank or have "lock" as a class.
            if (dice.positionValues[0] === 0) {
                return
            } else if (dice.rollBoolean[i]) {
                dicePositions[i].classList.toggle("select");
            }
    });
}

// --- Hold --- \\

// Hold Dice - Switch player
document.getElementById("hold-button").addEventListener('click',() => {
    const activePlayer_1 = document.getElementById("player1")
    const activePlayer_2 = document.getElementById("player2")

    //switch Player
    activePlayer_1.classList.toggle("active")
    activePlayer_2.classList.toggle("active")

    //reset on roundTotal and selectedTotal points
    points.roundTotal = 0
    points.selectedTotal = 0

})

// --- Score --- \\

// Points information
points = {
    player1: 0,
    player2: 0,
    roundTotal: 0,
    selectedTotal: 0
}


// positionValues Dice rolled lead to points - Reset Roll

// Reset Game

// --- Event Listeners --- \\
document.getElementById("roll-button").addEventListener("click", () => {
    rollAvailable();
    displayDice();
    console.log(dice.positionValues);
});

// dicePositions.forEach(die => {
//     if (dice_pos1.src.endsWith("blank_dice.png") === false )
// })
