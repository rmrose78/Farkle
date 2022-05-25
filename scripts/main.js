const activePlayer1 = document.getElementById("player1");
const activePlayer2 = document.getElementById("player2");
const scorePlayer1 = document.getElementById("player1-score--value");
const scorePlayer2 = document.getElementById("player2-score--value");
const uncommitedPoints = document.getElementById("points-current");
const dicePositions = document.getElementsByClassName("dice");
const roll = document.getElementById("roll-button");
const hold = document.getElementById("hold-button");
const reset = document.getElementById("reset");
const select = document.getElementById("dice-container");

const dice = {
  positionValues: Array(6).fill(0),
  shouldRoll: Array(6).fill(false),
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

points = {
  player1: 0,
  player2: 0,
  turnTotal: 0,
  winCondition: 10_000,
  lockGame: false,

  updatePlayerDisplay: function () {
    if (scoring.selectedTotal === 0) {
      this.turnTotal = 0;
      scoring.selectedTotal = 0;
    }

    if (activePlayer1.classList.contains("active")) {
      points.player1 += this.turnTotal + scoring.selectedTotal;
      scorePlayer1.innerHTML = points.player1;
    } else {
      points.player2 += this.turnTotal + scoring.selectedTotal;
      scorePlayer2.innerHTML = points.player2;
    }
  },

  toggleLockGame: function (bool) {
    this.lockGame = bool;
    if (bool === true) {
      points.ShouldRoll = Array(6).fill(false);
    } else {
      points.ShouldRoll = Array(6).fill(true);
    }
  },
};

// --- SCORING --- \\

scoring = {
  selectedTotal: 0,
  tempShouldRoll: Array(6).fill(true),
  diceSelectedArr: [],
  frequencyObj: {},
  keyNames: [],

  calculate: function () {
    this.diceSelected();
    this.frequency();
    this.readDiceCombos();
  },

  diceSelected: function () {
    this.diceSelectedArr = [];
    for (const die of dice.positions) {
      if (
        dicePositions[die].classList.contains("select") &&
        dice.shouldRoll[die]
      ) {
        this.diceSelectedArr.push(dice.positionValues[die]);
      }
    }
  },

  frequency: function () {
    this.frequencyObj = {};

    this.diceSelectedArr.forEach((die) => {
      if (this.frequencyObj[die]) this.frequencyObj[die]++;
      else this.frequencyObj[die] = 1;
    });
  },

  readDiceCombos: function () {
    scoring.selectedTotal = 0;
    this.keyNames = Object.keys(this.frequencyObj);

    if (this.diceSelectedArr.length === 6) {
      if (this.sixOfAKind()) {
        this.updatePointsAndTempShouldRoll(3000, true);
        return;
      } else if (this.twoTriplets()) {
        this.updatePointsAndTempShouldRoll(2500, true);
        return;
      } else if (this.quadrupletAndPair1()) {
        this.updatePointsAndTempShouldRoll(1500, true);
        return;
      } else if (this.quadrupletAndPair2()) {
        this.updatePointsAndTempShouldRoll(1500, true);
        return;
      } else if (this.threePairs()) {
        this.updatePointsAndTempShouldRoll(1500, true);
        return;
      } else if (this.straight()) {
        this.updatePointsAndTempShouldRoll(1500, true);
        return;
      }
    } else {
      for (let i = 0; i < this.keyNames.length; i++) {
        if (this.onesFreqLessThanThree(i)) {
          pointsSelect = this.frequencyObj[this.keyNames[i]] * 100;
          this.updatePointsAndTempShouldRoll(pointsSelect, false, 1);
          continue;
        } else if (this.fivesFreqLessThanThree(i)) {
          pointsSelect = this.frequencyObj[this.keyNames[i]] * 50;
          this.updatePointsAndTempShouldRoll(pointsSelect, false, 5);
          continue;
        } else if (this.fiveOfAKind()) {
          dieValue = parseInt(this.keyNames[i]);
          this.updatePointsAndTempShouldRoll(2000, false, dieValue);
          continue;
        } else if (this.fourOfAKind()) {
          dieValue = parseInt(this.keyNames[i]);
          this.updatePointsAndTempShouldRoll(1000, false, dieValue);
          continue;
        } else if (this.threeOfAKind(i)) {
          if (this.threeOnes(i)) {
            this.updatePointsAndTempShouldRoll(300, false, 1);
            continue;
          } else {
            dieValue = parseInt(this.keyNames[i]);
            pointsSelect = dieValue * 100;
            this.updatePointsAndTempShouldRoll(pointsSelect, false, dieValue);
            continue;
          }
        }
      }
    }
  },

  tempShouldRollAllDiceSelected: function () {
    this.tempShouldRoll = Array(6).fill(false);
  },

  tempShouldRollDiceValueSelected: function (dieValue) {
    for (const die of dice.positions) {
      if (
        dice.positionValues[die] === dieValue &&
        dice.shouldRoll[die] &&
        dicePositions[die].classList.contains("select")
      ) {
        this.tempShouldRoll[die] = false;
      }
    }
  },

  /**
   * @param {*} points - points to update.
   * @param {*} bool - Was all dice in one roll used for points?
   * @param {*} dieValue - if boo = false, die value required.
   */
  updatePointsAndTempShouldRoll: function (points, bool, dieValue) {
    this.selectedTotal = this.selectedTotal + points;
    if (bool === true) this.tempShouldRollAllDiceSelected();
    else this.tempShouldRollDiceValueSelected(dieValue);
  },

  sixOfAKind: function () {
    return this.frequencyObj[this.keyNames[0]] === 6;
  },

  twoTriplets: function () {
    return (
      this.frequencyObj[this.keyNames[0]] === 3 &&
      this.frequencyObj[this.keyNames[1]] === 3
    );
  },

  quadrupletAndPair1: function () {
    return (
      this.frequencyObj[this.keyNames[0]] === 4 &&
      this.frequencyObj[this.keyNames[1]] === 2
    );
  },

  quadrupletAndPair2: function () {
    return (
      this.frequencyObj[this.keyNames[0]] === 2 &&
      this.frequencyObj[this.keyNames[1]] === 4
    );
  },

  threePairs: function () {
    return (
      this.frequencyObj[this.keyNames[0]] === 2 &&
      this.frequencyObj[this.keyNames[1]] === 2 &&
      this.frequencyObj[this.keyNames[2]] === 2
    );
  },

  straight: function () {
    return this.keyNames.length === 6;
  },

  onesFreqLessThanThree: function (i) {
    return this.keyNames[i] == 1 && this.frequencyObj[this.keyNames[i]] < 3;
  },

  fivesFreqLessThanThree: function (i) {
    return this.keyNames[i] == 5 && this.frequencyObj[this.keyNames[i]] < 3;
  },

  fiveOfAKind: function () {
    return (
      this.frequencyObj[this.keyNames[0]] === 5 ||
      this.frequencyObj[this.keyNames[1]] === 5
    );
  },

  fourOfAKind: function () {
    return (
      this.frequencyObj[this.keyNames[0]] === 4 ||
      this.frequencyObj[this.keyNames[1]] === 4 ||
      this.frequencyObj[this.keyNames[2]] === 4
    );
  },

  threeOfAKind: function (i) {
    return this.frequencyObj[this.keyNames[i]] === 3;
  },

  threeOnes: function (i) {
    return this.keyNames[i] == 1;
  },
};

action = {
  roll: function () {
    if (!points.lockGame) {
      if (scoring.selectedTotal > 0 || dice.positionValues.includes(0)) {
        dice.updateShouldRoll();
        playerNotificationText("Select Dice, Roll, or Hold");

        if (dice.shouldRoll.every((die) => die === false)) {
          dice.shouldRoll = Array(6).fill(true);
          scoring.tempShouldRoll = Array(6).fill(true);
        }

        dice.rollAvailable();
        dice.removeSelectIfShouldRollTrue();
        dice.display();
        if (scoring.selectedTotal !== 0)
          points.turnTotal += scoring.selectedTotal;
        scoring.selectedTotal = 0;
      } else {
        dice.removeSelectIfShouldRollTrue();
      }
    }
  },

  select: function (e) {
    let die = e.target;
    let dicePosition = [...die.parentNode.children].indexOf(die);

    if (e.target.classList.contains("dice")) {
      if (!points.lockGame) {
        if (dice.shouldRoll[dicePosition] && !dice.positionValues.includes(0)) {
          die.classList.toggle("select");
          scoring.calculate();
          uncommitedPoints.innerHTML = points.turnTotal + scoring.selectedTotal;
        }
      }
    }
  },

  hold: function () {
    if (!points.lockGame) {
      if (!dice.positionValues.includes(0)) {
        points.updatePlayerDisplay();
        if (
          points.player1 >= points.winCondition ||
          points.player2 >= points.winCondition
        ) {
          playerNotificationText("WINS!!!!");
          points.toggleLockGame(true);
        } else {
          activePlayer1.classList.toggle("active");
          activePlayer2.classList.toggle("active");
          playerNotificationText("Roll Dice");
          points.turnTotal = 0;
          scoring.selectedTotal = 0;
          uncommitedPoints.innerHTML = 0;
          dice.removeAllSelect();
          dice.positionValues = Array(6).fill(0);
          dice.shouldRoll = Array(6).fill(true);
          scoring.tempShouldRoll = Array(6).fill(true);
          dice.display();
        }
      }
    }
  },

  reset: function () {
    activePlayer1.classList.add("active");
    activePlayer2.classList.remove("active");
    playerNotificationText("Roll Dice");
    points.toggleLockGame(false);
    points.player1 = 0;
    points.player2 = 0;
    points.turnTotal = 0;
    scoring.selectedTotal = 0;
    uncommitedPoints.innerHTML = 0;
    scorePlayer1.innerHTML = 0;
    scorePlayer2.innerHTML = 0;
    dice.removeAllSelect();
    dice.positionValues = Array(6).fill(0);
    dice.shouldRoll = Array(6).fill(true);
    scoring.tempShouldRoll = Array(6).fill(true);
    dice.display();
  },
};

const playerNotificationText = (text) => {
  if (activePlayer1.classList.contains("active"))
    notification.innerHTML = `Player 1: ${text}`;
  else notification.innerHTML = `Player 2: ${text}`;
};

const listeners = [
  [roll, action.roll],
  [select, action.select],
  [hold, action.hold],
  [reset, action.reset],
];

listeners.forEach((listener) =>
  listener[0].addEventListener("click", listener[1])
);
