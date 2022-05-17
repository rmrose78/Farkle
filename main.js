// --- DOM ELEMENTS --- \\

const activePlayer1 = document.getElementById("player1");
const activePlayer2 = document.getElementById("player2");
const scorePlayer1 = document.getElementById("player1-score--value");
const scorePlayer2 = document.getElementById("player2-score--value");
const uncommitedPoints = document.getElementById("points-current");
const dicePositions = document.getElementsByClassName("dice");
const rollBtn = document.getElementById("roll-button");
const holdBtn = document.getElementById("hold-button");
const resetBtn = document.getElementById("reset");

// --- DICE --- \\

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

  removeAllSelect: function () {
    for (const die of this.positions) {
      dicePositions[die].classList.remove("select");
    }
  },

  /**
   * Update shouldRoll from tempShouldRoll during scoring
   */
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

// --- POINTS --- \\

points = {
  player1: 0,
  player2: 0,
  turnTotal: 0,

  updateDisplay: function (selectedTotal) {
    if (scoring.selectedTotal === 0) {
      this.turnTotal = 0;
      selectedTotal = 0;
    }

    if (activePlayer1.classList.contains("active")) {
      points.player1 += this.turnTotal + selectedTotal;
      scorePlayer1.innerHTML = points.player1;
    } else {
      if (scoring.selectedTotal > 0) {
        points.player2 += this.turnTotal + selectedTotal;
        scorePlayer2.innerHTML = points.player2;
      }
    }
  },
};

// --- SCORING --- \\

scoring = {
  selectedTotal: 0,
  tempShouldRoll: [true, true, true, true, true, true],

  calculate: function () {
    diceSelectedArr = this.diceSelected();
    freqObj = this.freq(diceSelectedArr);
    this.readDiceCombos(freqObj);
  },

  diceSelected: function () {
    diceSelectedArr = [];
    for (const die of dice.positions) {
      if (
        dicePositions[die].classList.contains("select") &&
        dice.shouldRoll[die]
      ) {
        diceSelectedArr.push(dice.positionValues[die]);
      }
    }
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
    keysOfFreqObj = Object.keys(freqObj);

    switch (true) {
      // 6 of a kind
      case freqObj[keysOfFreqObj[0]] === 6:
        this.selectedTotal += 3000;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // Two triplets
      case freqObj[keysOfFreqObj[0]] === 3 &&
        freqObj[`${keysOfFreqObj[1]}`] === 3:
        this.selectedTotal += 2500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // 4-o-kind and a pair - two ways 4&2 or 2&4
      case freqObj[keysOfFreqObj[0]] === 4 &&
        freqObj[`${keysOfFreqObj[1]}`] === 2:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      case freqObj[keysOfFreqObj[0]] === 2 &&
        freqObj[`${keysOfFreqObj[1]}`] === 4:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // three Pairs
      case freqObj[keysOfFreqObj[0]] === 2 &&
        freqObj[keysOfFreqObj[1]] === 2 &&
        freqObj[keysOfFreqObj[2]] === 2:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      // straight 1-6
      case keysOfFreqObj.length === 6:
        this.selectedTotal += 1500;
        updateTempShouldRoll.allDiceForPoints();
        break;
      default:
        for (let i = 0; i < keysOfFreqObj.length; i++) {
          switch (true) {
            // Ones freq less than three
            case keysOfFreqObj[i] == 1 && freqObj[keysOfFreqObj[i]] < 3:
              this.selectedTotal += freqObj[`${keysOfFreqObj[i]}`] * 100;
              updateTempShouldRoll.dieValueAllForPoints(1);
              continue;
            // fives freq less than three
            case keysOfFreqObj[i] == 5 && freqObj[keysOfFreqObj[i]] < 3:
              this.selectedTotal += freqObj[keysOfFreqObj[i]] * 50;
              updateTempShouldRoll.dieValueAllForPoints(5);
              continue;
            // 5-o-kind
            case freqObj[keysOfFreqObj[i]] === 5:
              this.selectedTotal += 2000;
              dieValue = parseInt(keysOfFreqObj[i]);
              updateTempShouldRoll.dieValueAllForPoints(dieValue);
              continue;
            // 4-o-kind
            case freqObj[keysOfFreqObj[i]] === 4:
              this.selectedTotal += 1000;
              dieValue = parseInt(keysOfFreqObj[i]);
              updateTempShouldRoll.dieValueAllForPoints(dieValue);
              continue;
            // 3-o-kind
            case freqObj[keysOfFreqObj[i]] === 3:
              // three ones
              if (keysOfFreqObj[i] == 1) {
                this.selectedTotal += 300;
                updateTempShouldRoll.dieValueAllForPoints(1);
                continue;
                // three x
              } else {
                dieValue = parseInt(keysOfFreqObj[i]);
                this.selectedTotal += dieValue * 100;
                updateTempShouldRoll.dieValueAllForPoints(dieValue);
                continue;
              }
          }
        }
    }
  },
};

// tempShouldRoll updated when dice selected and commited to shouldRoll during roll event.
const updateTempShouldRoll = {
  allDiceForPoints: function () {
    scoring.tempShouldRoll = [false, false, false, false, false, false];
  },

  dieValueAllForPoints: function (dieValue) {
    for (const die of dice.positions) {
      if (
        dice.positionValues[die] === dieValue &&
        dice.shouldRoll[die] &&
        dicePositions[die].classList.contains("select")
      ) {
        scoring.tempShouldRoll[die] = false;
      }
    }
  },
};

// --- ROLL DICE --- \\

rollBtn.addEventListener("click", () => {
  if (scoring.selectedTotal > 0 || dice.positionValues.includes(0)) {
    dice.updateShouldRoll();

    if (dice.shouldRoll.every((die) => die === false)) {
      dice.shouldRoll = [true, true, true, true, true, true];
      scoring.tempShouldRoll = [true, true, true, true, true, true];
    }

    dice.rollAvailable();
    dice.removeSelectIfShouldRollTrue();
    dice.display();
    if (scoring.selectedTotal !== 0) points.turnTotal += scoring.selectedTotal;
    scoring.selectedTotal = 0;
  } else {
    dice.removeSelectIfShouldRollTrue();
  }
});

// --- SELECT --- \\

// Event listeners added on all dice for toggling the 'select' class
for (const die of dice.positions) {
  dicePositions[die].addEventListener("click", () => {
    if (dice.shouldRoll[die] && !dice.positionValues.includes(0)) {
      dicePositions[die].classList.toggle("select");
      scoring.calculate();
      uncommitedPoints.innerHTML = points.turnTotal + scoring.selectedTotal;
    }
  });
}

// --- HOLD --- \\

// Hold Dice - Switch player
holdBtn.addEventListener("click", () => {
  if (!dice.positionValues.includes(0)) {
    points.updateDisplay(scoring.selectedTotal);
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
  }
});

// --- RESET --- \\

resetBtn.addEventListener("click", () => {
  activePlayer1.classList.add("active");
  activePlayer2.classList.remove("active");
  points.player1 = 0;
  points.player2 = 0;
  points.turnTotal = 0;
  scoring.selectedTotal = 0;
  uncommitedPoints.innerHTML = 0;
  scorePlayer1.innerHTML = 0;
  scorePlayer2.innerHTML = 0;
  dice.removeAllSelect();
  dice.positionValues = [0, 0, 0, 0, 0, 0];
  dice.shouldRoll = [true, true, true, true, true, true];
  scoring.tempShouldRoll = [true, true, true, true, true, true];
  dice.display();
});
