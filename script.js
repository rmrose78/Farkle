// --- Constants --- \\
const rollButton = document.getElementById("roll-button");
const holdButton = document.getElementById("hold-button");
const diceAll = document.querySelectorAll("dice");
const activePlayer_1 = document.getElementById("player1");
const activePlayer_2 = document.getElementById("player2");
const dice_positions = document.getElementsByClassName('dice');

const diceImages = [
  "./images/1_dice.png",
  "./images/2_dice.png",
  "./images/3_dice.png",
  "./images/4_dice.png",
  "./images/5_dice.png",
  "./images/6_dice.png",
]

// --- Global variables --- \\
let dice = []
let diceAvailable = []
let diceSelected = []
let ignoreRoll = []
let roundPointsTotal = 0

// --- Functions --- \\
// Rolling Dice
const rollDie = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const rollAvailableDice = () => {
  diceAvailable = []
  diceSelected = []
  let tempIgnoreRoll = []
  let tempDice = []
  let tempRoll = 0;
  
  for (let i = 0; i < dice_positions.length; i++) {
    tempRoll = rollDie()
    if (dice_positions[i].classList[1] === 'select') {
      tempDice.push(dice[i])
      tempIgnoreRoll.push(true)
    } else {
      tempDice.push(tempRoll)
      diceAvailable.push(tempRoll)
      tempIgnoreRoll.push(false)
      dice_positions[i].src = diceImages[tempRoll - 1];
    }
  }
  dice = tempDice
  ignoreRoll = tempIgnoreRoll
};

// Check dice after selected
const diceCheck = () => {
  diceSelected = []

  for (let i = 0; i < dice_positions.length; i++) {
      if (dice_positions[i].classList[1] !== 'select' || ignoreRoll[i]) {
        continue
      } else {
      diceSelected.push(dice[i])
    }
  }
  console.log(`Dice selected: ${diceSelected}`);
}

// Hold dice
const holdPlayerSwitch = () => {
  for (i = 0; i < dice_positions.length; i++) {
    dice_positions[i].classList.remove("select");
  }

  activePlayer_1.classList.toggle("active");
  activePlayer_2.classList.toggle("active");

  diceAvailable = []
  ignoreRoll = []
  diceSelected = [];

  //remove and reset to blank dice
  rollAvailableDice()
}

// Game Points Logic
const selectedDiceScore = () => {
  const uncommitedPoints = document.getElementById("currentPoints");

  let selectedPoints = 0
  diceSelected = diceSelected.sort()
  
  
  for (let i = 0; i < diceSelected.length; i++) {
    switch (true) {
      // Four of a kind
      case diceSelected[i] === diceSelected[i - 1] && diceSelected[i] === diceSelected[i - 2] && diceSelected[i] === diceSelected[i - 3]:
        selectedPoints = 1000
        break
        // Three of a kind
      case diceSelected[i] === diceSelected[i - 1] && diceSelected[i] === diceSelected[i - 2]:
          // Number for points
        switch (true) {
          case diceSelected[i] === 1:
            selectedPoints = 300
            break
          case diceSelected[i] === 2:
            selectedPoints = 200
            break
          case diceSelected[i] === 3:
            selectedPoints = 300
            break
          case diceSelected[i] === 4:
            selectedPoints = 400
            break
          case diceSelected[i] === 5:
            selectedPoints = 500
            break
          case diceSelected[i] === 6:
            selectedPoints = 600
            break
        }
      // Two - 1s
      case diceSelected[i] === 1 && diceSelected[i - 1] === 1:
        selectedPoints = 200
        break
      // One - 1s
      case diceSelected[i] === 1:
        selectedPoints = 100
        break
      // Two - 5s
      case diceSelected[i] === 5 && diceSelected[i] == 5:
        selectedPoints = 100
        break
      // One - 5s
      case diceSelected[i] === 5:
        selectedPoints = 50
        break
      default:
        selectedPoints = 20;
    }
  }
  uncommitedPoints.innerHTML = selectedPoints
  console.log(diceSelected)
}

// --- Event listeners ---
// Roll dice
rollButton.addEventListener("click", rollAvailableDice);

// Hold
holdButton.addEventListener("click", holdPlayerSwitch);

// Select Die
for (let i = 0; i < dice_positions.length; i++) {
  dice_positions[i].addEventListener('click', () => {
    dice_positions[i].classList.toggle("select")
    diceCheck()
    selectedDiceScore()
  })
}