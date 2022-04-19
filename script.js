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
let diceAvailableArray = []
let diceSelectedArray = []
let ignorePositionsArray = []


// --- Functions --- \\
// Rolling Dice
const rollDie = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const rollAvailableDice = () => {
  let tempRoll = 0;
  diceAvailableArray = []
  ignorePositionsArray =[]
  diceSelectedArray = []

  for (let i = 0; i < dice_positions.length; i++) {
    tempRoll = rollDie()
    if (dice_positions[i].classList.value === "dice select") {
      ignorePositionsArray.push(i)
    } else {
      diceAvailableArray.push(tempRoll)
      dice_positions[i].src = diceImages[tempRoll - 1];
    }
  }
};

// Check dice after selected
const diceCheck = () => {
  diceSelectedArray = []

  for (let i = 0; i < dice_positions.length; i++) {
      if (dice_positions[i].className !== 'dice select' || ignorePositionsArray.includes(i)) {
        continue
      } else {
      diceSelectedArray.push(checkImageForRollValue(i))
    }
  }
  console.log(`Dice selected: ${diceSelectedArray}`);
}

const checkImageForRollValue = (positionNum) => {
  let temp = dice_positions[positionNum].src
  let srcString = temp.substring(temp.length - 10, temp.length)
  let rollValue = []

  switch (srcString) {
    case '1_dice.png':
      rollValue = 1
      break
    case '2_dice.png':
      rollValue = 2
      break
    case '3_dice.png':
      rollValue = 3
      break
    case '4_dice.png':
      rollValue = 4
      break
    case '5_dice.png':
      rollValue = 5
      break
    case '6_dice.png':
      rollValue = 6
      break
  }
return rollValue
}

// Points logic


// Hold dice
const holdPlayerSwitch = () => {
  for (i = 0; i < dice_positions.length; i++) {
    dice_positions[i].classList.remove("select");
  }

  activePlayer_1.classList.toggle("active");
  activePlayer_2.classList.toggle("active");

  diceAvailableArray = []
  ignorePositionsArray = []
  diceSelectedArray = [];

  //remove and reset to blank dice
  rollAvailableDice()
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
  })
}