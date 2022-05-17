// --- DOM ELEMENTS --- \\

const activePlayer1 = document.getElementById("player1");
const activePlayer2 = document.getElementById("player2");
const scorePlayer1 = document.getElementById("player1-score--value");
const scorePlayer2 = document.getElementById("player2-score--value");
const dicePositions = document.getElementsByClassName("dice");
const uncommitedPoints = document.getElementById("points-current");

// --- ROLL DICE --- \\

document.getElementById("roll-button").addEventListener("click", () => {
  dice.updateShouldRoll();
  dice.rollAvailable();
  dice.display();
  console.log(dice.positionValues);
  points.turnTotal += points.selectedTotal;
  points.selectedTotal = 0;
});

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
    for (const die of this.positions) {
      dicePositions[die].classList.remove("select");
    }
  },
};

// --- SELECT --- \\

// Event listers added on all dice for toggling the 'select' class
for (const die of dice.positions) {
  dicePositions[die].addEventListener("click", () => {
    if (dice.shouldRoll[die] && dice.positionValues[0] !== 0) {
      dicePositions[die].classList.toggle("select");

      points.selectedTotal = 0;
      points.calculate();
      uncommitedPoints.innerHTML = points.turnTotal + points.selectedTotal;
    }
  });
}

// --- HOLD --- \\

// Hold Dice - Switch player
document.getElementById("hold-button").addEventListener("click", () => {
  if (activePlayer1.classList[1] === "active") {
    scorePlayer1.innerHTML = points.turnTotal + points.selectedTotal;
  } else {
    scorePlayer2.innerHTML = points.turnTotal + points.selectedTotal;
  }

  activePlayer1.classList.toggle("active");
  activePlayer2.classList.toggle("active");

  points.turnTotal = 0;
  points.selectedTotal = 0;
  uncommitedPoints.innerHTML = 0;

  dice.removeAllSelect();
  dice.positionValues = [0, 0, 0, 0, 0, 0];
  dice.shouldRoll = [true, true, true, true, true, true];
  dice.display();
});

// --- SCORE --- \\

points = {
  player1: 0,
  player2: 0,
  turnTotal: 0,
  selectedTotal: 0,

  calculate: function () {
    diceSelected = this.diceSelected();

    freqObj = this.freq(diceSelected);
    console.log(freqObj);

    this.scoring(freqObj);
  },

  diceSelected: function () {
    diceSelected = [];
    for (const die of dice.positions) {
      if (
        dicePositions[die].classList[1] === "select" &&
        dice.shouldRoll[die]
      ) {
        diceSelected.push(dice.positionValues[die]);
      }
    }
    return diceSelected;
  },

  freq: function (diceSelected) {
    let freqObj = {};

    diceSelected.forEach((die) => {
      if (freqObj[die]) freqObj[die]++;
      else freqObj[die] = 1;
    });
    return freqObj;
  },

  scoring: function (freqObj) {
    freqKeys = Object.keys(freqObj);

    switch (true) {
      // 6 of a kind
      case freqObj[`${freqKeys[0]}`] === 6:
        this.selectedTotal += 3000;
        break;
      // Two triplets
      case freqObj[`${freqKeys[0]}`] === 3 && freqObj[`${freqKeys[1]}`] === 3:
        this.selectedTotal += 2500;
        break;
      // 4-o-kind and a pair - two ways 4&2 or 2&4
      case freqObj[`${freqKeys[0]}`] === 4 && freqObj[`${freqKeys[1]}`] === 2:
        this.selectedTotal += 1500;
        break;
      case freqObj[`${freqKeys[0]}`] === 2 && freqObj[`${freqKeys[1]}`] === 4:
        this.selectedTotal += 1500;
        break;
      // three Pairs
      case freqObj[`${freqKeys[0]}`] === 2 &&
        freqObj[`${freqKeys[1]}`] === 2 &&
        freqObj[`${freqKeys[2]}`] === 2:
        this.selectedTotal += 1500;
        break;
      // straight 1-6
      case freqKeys.length === 6:
        this.selectedTotal += 1500;
        break;
      default:
        for (let i = 0; i < freqKeys.length; i++) {
          switch (true) {
            // Ones freq less than three
            case freqKeys[i] == 1 && freqObj[`${freqKeys[i]}`] < 3:
              this.selectedTotal += freqObj[`${freqKeys[i]}`] * 100;
              continue;
            // fives freq less than three
            case freqKeys[i] == 5 && freqObj[`${freqKeys[i]}`] < 3:
              this.selectedTotal += freqObj[`${freqKeys[i]}`] * 50;
              continue;
            // 5-o-kind
            case freqObj[`${freqKeys[i]}`] === 5:
              this.selectedTotal += 2000;
              continue;
            // 4-o-kind
            case freqObj[`${freqKeys[i]}`] === 4:
              this.selectedTotal += 1000;
              continue;
            // 3-o-kind
            case freqObj[`${freqKeys[i]}`] === 3:
              // three ones
              if (freqKeys[i] == 1) {
                this.selectedTotal += 300;
                continue;
                // three x
              } else {
                dieValue = parseInt(freqKeys[i]);
                this.selectedTotal += dieValue * 100;
                continue;
              }
          }
        }
    }
  },
};

// positionValues Dice rolled lead to points - Reset Roll

// --- RESET --- \\

// --- EVENT LISTENERS --- \\

// dicePositions.forEach(die => {
//     if (dice_pos1.src.endsWith("blank_dice.png") === false )
// })
