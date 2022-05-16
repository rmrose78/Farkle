// --- DOM ELEMENTS --- \\

const activePlayer1 = document.getElementById("player1");
const activePlayer2 = document.getElementById("player2");
const scorePlayer1 = document.getElementById("player1-score--value");
const scorePlayer2 = document.getElementById("player2-score--value");
const dicePositions = document.getElementsByClassName("dice");
const uncommitedPoints = document.getElementById("points-current");

// --- ROLL DICE --- \\

document.getElementById("roll-button").addEventListener("click", () => {
  if (scoring.selectedTotal > 0 || dice.positionValues[0] === 0) {
    dice.updateShouldRoll();

    if (dice.shouldRoll.every((die) => die === false)) {
      dice.shouldRoll = [true, true, true, true, true, true];
      scoring.tempShouldRoll = [true, true, true, true, true, true];
    }

    dice.rollAvailable();
    dice.removeSelectIfShouldRollTrue();
    dice.display();

    points.turnTotal += scoring.selectedTotal;
    scoring.selectedTotal = 0;
  } else {
    dice.removeSelectIfShouldRollTrue();
  }
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

  removeSelectIfShouldRollTrue: function () {
    for (const die of this.positions) {
      if (this.shouldRoll[die]) dicePositions[die].classList.remove("select");
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

  updateShouldRoll: function () {
    for (const die of dice.positions) {
      if (
        dice.shouldRoll[die] === true &&
        scoring.tempShouldRoll[die] === false
      ) {
        dice.shouldRoll[die] = false;
      }
    }
  },
};

// --- SELECT --- \\

// Event listers added on all dice for toggling the 'select' class
for (const die of dice.positions) {
  dicePositions[die].addEventListener("click", () => {
    if (dice.shouldRoll[die] && dice.positionValues[0] !== 0) {
      dicePositions[die].classList.toggle("select");

      scoring.calculate();
      uncommitedPoints.innerHTML = points.turnTotal + scoring.selectedTotal;
    }
  });
}

// --- HOLD --- \\

// Hold Dice - Switch player
document.getElementById("hold-button").addEventListener("click", () => {
  if (activePlayer1.classList[1] === "active") {
    scorePlayer1.innerHTML = points.turnTotal + scoring.selectedTotal;
  } else {
    scorePlayer2.innerHTML = points.turnTotal + scoring.selectedTotal;
  }

  activePlayer1.classList.toggle("active");
  activePlayer2.classList.toggle("active");

  points.turnTotal = 0;
  scoring.selectedTotal = 0;
  uncommitedPoints.innerHTML = 0;

  dice.removeAllSelect();
  dice.positionValues = [0, 0, 0, 0, 0, 0];
  dice.shouldRoll = [true, true, true, true, true, true];
  scoring.tempShouldRoll = [true, true, true, true, true, true];
  dice.display();
});

// --- SCORE --- \\

points = {
  player1: 0,
  player2: 0,
  turnTotal: 0,
};

scoring = {
  selectedTotal: 0,
  tempShouldRoll: [true, true, true, true, true, true],

  calculate: function () {
    diceSelectedArr = this.diceSelected();

    freqObj = this.freq(diceSelectedArr);
    console.log(freqObj);

    this.readDiceCombos(freqObj);
  },

  diceSelected: function () {
    diceSelectedArr = [];
    for (const die of dice.positions) {
      if (
        dicePositions[die].classList[1] === "select" &&
        dice.shouldRoll[die]
      ) {
        diceSelectedArr.push(dice.positionValues[die]);
      }
    }
    console.log(`diceSelectedArr: ${diceSelectedArr}`);
    return diceSelectedArr;
  },

  freq: function (diceSelectedArr) {
    freqObj = {};

    diceSelectedArr.forEach((die) => {
      if (freqObj[die]) freqObj[die]++;
      else freqObj[die] = 1;
    });

    return freqObj;
  },

  readDiceCombos: function (freqObj) {
    scoring.selectedTotal = 0;

    freqKeys = Object.keys(freqObj);

    console.log(`freqKeys: ${freqKeys}`);

    switch (true) {
      // 6 of a kind
      case freqObj[`${freqKeys[0]}`] === 6:
        this.selectedTotal += 3000;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // Two triplets
      case freqObj[`${freqKeys[0]}`] === 3 && freqObj[`${freqKeys[1]}`] === 3:
        this.selectedTotal += 2500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // 4-o-kind and a pair - two ways 4&2 or 2&4
      case freqObj[`${freqKeys[0]}`] === 4 && freqObj[`${freqKeys[1]}`] === 2:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      case freqObj[`${freqKeys[0]}`] === 2 && freqObj[`${freqKeys[1]}`] === 4:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // three Pairs
      case freqObj[`${freqKeys[0]}`] === 2 &&
        freqObj[`${freqKeys[1]}`] === 2 &&
        freqObj[`${freqKeys[2]}`] === 2:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // straight 1-6
      case freqKeys.length === 6:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      default:
        for (let i = 0; i < freqKeys.length; i++) {
          switch (true) {
            // Ones freq less than three
            case freqKeys[i] == 1 && freqObj[`${freqKeys[i]}`] < 3:
              this.selectedTotal += freqObj[`${freqKeys[i]}`] * 100;
              updateTempShouldRoll.dieValueAllForPoints(1);
              continue;
            // fives freq less than three
            case freqKeys[i] == 5 && freqObj[`${freqKeys[i]}`] < 3:
              this.selectedTotal += freqObj[`${freqKeys[i]}`] * 50;
              updateTempShouldRoll.dieValueAllForPoints(5);
              continue;
            // 5-o-kind
            case freqObj[`${freqKeys[i]}`] === 5:
              this.selectedTotal += 2000;
              dieValue = parseInt(freqKeys[i]);
              updateTempShouldRoll.dieValueAllForPoints(dieValue);
              continue;
            // 4-o-kind
            case freqObj[`${freqKeys[i]}`] === 4:
              this.selectedTotal += 1000;
              dieValue = parseInt(freqKeys[i]);
              updateTempShouldRoll.dieValueAllForPoints(dieValue);
              continue;
            // 3-o-kind
            case freqObj[`${freqKeys[i]}`] === 3:
              // three ones
              if (freqKeys[i] == 1) {
                this.selectedTotal += 300;
                updateTempShouldRoll.dieValueAllForPoints(1);
                continue;
                // three x
              } else {
                dieValue = parseInt(freqKeys[i]);
                this.selectedTotal += dieValue * 100;
                updateTempShouldRoll.dieValueAllForPoints(dieValue);
                continue;
              }
          }
        }
    }
  },
};

const updateTempShouldRoll = {
  allDiceForPoints: function () {
    scoring.tempShouldRoll = [false, false, false, false, false, false];
  },

  dieValueAllForPoints: function (dieValue) {
    for (const die of dice.positions) {
      if (
        dice.positionValues[die] === dieValue &&
        dice.shouldRoll[die] &&
        dicePositions[die].classList[1] === "select"
      ) {
        scoring.tempShouldRoll[die] = false;
      }
    }
    console.log(`${dice.shouldRoll}`);
    console.log(`${scoring.tempShouldRoll}`);
  },
};

// positionValues Dice rolled lead to points - Reset Roll

// --- RESET --- \\

// --- EVENT LISTENERS --- \\

// dicePositions.forEach(die => {
//     if (dice_pos1.src.endsWith("blank_dice.png") === false )
// })
