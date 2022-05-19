// --- DOM ELEMENTS --- \\

const activePlayer1 = document.getElementById("player1");
const activePlayer2 = document.getElementById("player2");
const scorePlayer1 = document.getElementById("player1-score--value");
const scorePlayer2 = document.getElementById("player2-score--value");
const uncommitedPoints = document.getElementById("points-current");
const dicePositions = document.getElementsByClassName("dice");
const roll = document.getElementById("roll-button");
const hold = document.getElementById("hold-button");
const reset = document.getElementById("reset");
const gameNotify = document.getElementById("gameNotify");
const select = document.getElementById("dice-container");

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
  winCondition: 300,
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

  toggleLockGame: function (boo) {
    this.lockGame = boo;
    if (boo === true) {
      points.ShouldRoll = [false, false, false, false, false, false];
    } else {
      points.ShouldRoll = [true, true, true, true, true, true];
    }
  },
};

// --- SCORING --- \\

scoring = {
  selectedTotal: 0,
  tempShouldRoll: [true, true, true, true, true, true],
  diceSelectedArr: [],
  frequencyObj: {},

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
    let keyNames = Object.keys(this.frequencyObj);

    if (this.diceSelectedArr.length === 6) {
      if (this.frequencyObj[keyNames[0]] === 6) {
        this.updatePointsAndTempShouldRoll(3000, true); // 6-of-kind
        return;
      } else if (this.frequencyObj[keyNames[0]] === 6) {
        this.updatePointsAndTempShouldRoll(2500, true); // Two triplets
        return;
      } else if (
        this.frequencyObj[keyNames[0]] === 4 &&
        this.frequencyObj[keyNames[1]] === 2
      ) {
        this.updatePointsAndTempShouldRoll(1500, true); // Quadruplet & pair - 4&2
        return;
      } else if (
        this.frequencyObj[keyNames[0]] === 2 &&
        this.frequencyObj[keyNames[1]] === 4
      ) {
        this.updatePointsAndTempShouldRoll(1500, true); // Quadruplet & pair - 2&4
        return;
      } else if (
        this.frequencyObj[keyNames[0]] === 2 &&
        this.frequencyObj[keyNames[1]] === 2 &&
        this.frequencyObj[keyNames[2]] === 2
      ) {
        this.updatePointsAndTempShouldRoll(1500, true); // Three Pairs
        return;
      } else if (keyNames.length === 6) {
        this.updatePointsAndTempShouldRoll(1500, true); // Straight
        return;
      }
    } else {
      for (let i = 0; i < keyNames.length; i++) {
        if (keyNames[i] == 1 && this.frequencyObj[keyNames[i]] < 3) {
          pointsSelect = this.frequencyObj[keyNames[i]] * 100;
          this.updatePointsAndTempShouldRoll(pointsSelect, false, 1); // Ones - frequency < 3
          continue;
        } else if (keyNames[i] == 5 && this.frequencyObj[keyNames[i]] < 3) {
          pointsSelect = this.frequencyObj[keyNames[i]] * 50;
          this.updatePointsAndTempShouldRoll(pointsSelect, false, 5); // fives - frequency < 3
          continue;
        } else if (this.frequencyObj[keyNames[i]] === 5) {
          dieValue = parseInt(keyNames[i]);
          this.updatePointsAndTempShouldRoll(2000, false, dieValue); // 5-o-kind
          continue;
        } else if (this.frequencyObj[keyNames[i]] === 3) {
          if (keyNames[i] == 1) {
            this.updatePointsAndTempShouldRoll(300, false, 1); // Three ones
            continue;
          } else {
            dieValue = parseInt(keyNames[i]);
            pointsSelect = dieValue * 100;
            this.updatePointsAndTempShouldRoll(pointsSelect, false, dieValue);
            continue; // Three Xs
          }
        }
      }
    }
  },

  tempShouldRollAllDiceSelected: function () {
    this.tempShouldRoll = [false, false, false, false, false, false];
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
   * @param {*} boo - Was all dice of one roll used for points?
   * @param {*} dieValue - if boo = false, die value required.
   */
  updatePointsAndTempShouldRoll: function (points, boo, dieValue) {
    this.selectedTotal = this.selectedTotal + points;
    if (boo === true) this.tempShouldRollAllDiceSelected();
    else this.tempShouldRollDiceValueSelected(dieValue);
  },
};

action = {
  roll: () => {
    if (!points.lockGame) {
      if (scoring.selectedTotal > 0 || dice.positionValues.includes(0)) {
        dice.updateShouldRoll();
        playerNotificationText("Select Dice, Roll, or Hold");

        if (dice.shouldRoll.every((die) => die === false)) {
          dice.shouldRoll = [true, true, true, true, true, true];
          scoring.tempShouldRoll = [true, true, true, true, true, true];
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

  select: (e) => {
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

  hold: () => {
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
          dice.positionValues = [0, 0, 0, 0, 0, 0];
          dice.shouldRoll = [true, true, true, true, true, true];
          scoring.tempShouldRoll = [true, true, true, true, true, true];
          dice.display();
        }
      }
    }
  },

  reset: () => {
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
    dice.positionValues = [0, 0, 0, 0, 0, 0];
    dice.shouldRoll = [true, true, true, true, true, true];
    scoring.tempShouldRoll = [true, true, true, true, true, true];
    dice.display();
  },
};

const playerNotificationText = (text) => {
  if (activePlayer1.classList.contains("active"))
    notification.innerHTML = `Player 1: ${text}`;
  else notification.innerHTML = `Player 2: ${text}`;
};

roll.addEventListener("click", () => action.roll());
select.addEventListener("click", (e) => action.select(e));
hold.addEventListener("click", () => action.hold());
reset.addEventListener("click", () => action.reset());
