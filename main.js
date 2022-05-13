// --- DOM ELEMENTS --- \\

const activePlayer1 = document.getElementById("player1");
const activePlayer2 = document.getElementById("player2");
const valuePlayer1 = document.getElementById("player1-score--value");
const valuePlayer2 = document.getElementById("player2-score--value");
const dicePositions = document.getElementsByClassName("dice");
const uncommitedPoints = document.getElementById("currentPoints");

// --- ROLL DICE --- \\

const dice = {
  positionValues: [0, 0, 0, 0, 0, 0],
  shouldRoll: [true, true, true, true, true, true],
  positions: [0, 1, 2, 3, 4, 5],
  images: [
    "./images/blank_dice.png",
    "./images/1_dice.png",
    "./images/2_dice.png",
    "./images/3_dice.png",
    "./images/4_dice.png",
    "./images/5_dice.png",
    "./images/6_dice.png",
  ],

  /**
   * Roll a random number between 1-6.
   */
  rollDie: function () {
    return Math.floor(Math.random() * 6) + 1;
  },

  /**
   * Roll each die based if shouldRoll array is true for that die.
   */
  rollAvailable: function () {
    for (const die of this.positions) {
      if (this.shouldRoll[die]) this.positionValues[die] = this.rollDie();
    }
  },

  /**
   * Display dice - If 0 show blank die else show die image of the value.
   */
  display: function () {
    for (const die of this.positions) {
      this.positionValues[die] === 0
        ? (dicePositions[die].src = this.images[0])
        : (dicePositions[die].src = this.images[this.positionValues[die]]);
    }
  },

  /**
   * Dice selected will update shouldRoll to false to prevent rerolling that die.
   */
  updateShouldRoll: function () {
    for (const die of this.positions) {
      if (dicePositions[die].classList[1] === "select")
        this.shouldRoll[die] = false;
    }
  },

  /**
   * Remove 'select' class from all dice
   */
  removeAllSelect: function () {
    dicePositions.forEach((die) => {
      dicePositions[die].classList.toggle("select");
    });
  },
};

// --- SELECT --- \\

// Event listers added on all dice for toggling the 'select' class
for (const die of dice.positions) {
  dicePositions[die].addEventListener("click", () => {
    dicePositions[die].classList.toggle("select");
  });
}

// --- HOLD --- \\

// Hold Dice - Switch player
document.getElementById("hold-button").addEventListener("click", () => {
  activePlayer1.classList.toggle("active");
  activePlayer2.classList.toggle("active");

  points.roundTotal = 0;
  points.selectedTotal = 0;

  dice.removeAllSelect();
  dice.positionValues = [0, 0, 0, 0, 0, 0];
  dice.shouldRoll = [true, true, true, true, true, true];
  dice.display();
});

// --- SCORE --- \\

points = {
  player1: 0,
  player2: 0,
  roundTotal: 0,
  selectedTotal: 0,
};

// positionValues Dice rolled lead to points - Reset Roll

// --- RESET --- \\

// --- EVENT LISTENERS --- \\
document.getElementById("roll-button").addEventListener("click", () => {
  dice.updateShouldRoll();
  dice.rollAvailable();
  dice.display();
  console.log(dice.positionValues);
});

// dicePositions.forEach(die => {
//     if (dice_pos1.src.endsWith("blank_dice.png") === false )
// })
