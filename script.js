// --- Constants --- \\
const rollButton = document.getElementById("roll-button");
const holdButton = document.getElementById("hold-button");
const diceAll = document.querySelectorAll("dice");
const activePlayer_1 = document.getElementById("player1");
const activePlayer_2 = document.getElementById("player2");
const valuePlayer_1 = document.getElementById("player1-score--value")
const valuePlayer_2 = document.getElementById("player2-score--value")
const dice_positions = document.getElementsByClassName('dice');
const dice_pos1 = document.getElementById("dice-pos1")
const uncommitedPoints = document.getElementById("currentPoints")

const diceImages = [
  "./images/1_dice.png",
  "./images/2_dice.png",
  "./images/3_dice.png",
  "./images/4_dice.png",
  "./images/5_dice.png",
  "./images/6_dice.png",
]

const diceImageBlank = "/images/blank_dice.png"

// --- Global variables --- \\
let dice = []
let diceAvailable = []
let diceSelected = []
let ignoreRoll = []
let roundPoints = 0
let pointsPlayer1 = 0
let pointsPlayer2 = 0
let points = 0
let totalPoints = 0
let playerTurnFirstRoll = true
let diceLeadToPoints = [false, false, false, false, false, false]
let diceLeadToPointsTemp = [false, false, false, false, false, false]

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


  playerTurnFirstRoll = false
  for (let i = 0; i < dice_positions.length; i++) {
    tempRoll = rollDie()
    if (dice_positions[i].classList[1] === 'select') {
      tempDice.push(dice[i])
      tempIgnoreRoll.push(true)
      dice_positions[i].classList.toggle("lock")

    } else {
      tempDice.push(tempRoll)
      diceAvailable.push(tempRoll)
      tempIgnoreRoll.push(false)
      dice_positions[i].src = diceImages[tempRoll - 1];
    }
  }
  roundPoints += points
  points = 0
  dice = tempDice
  ignoreRoll = tempIgnoreRoll
};

// Check dice after selected
const diceCheck = () => {
  diceSelected = []

  for (let i = 0; i < dice_positions.length; i++) {
      if (dice_positions[i].classList[1] !== 'select' || ignoreRoll[i]) {
      } else {
        diceSelected.push(dice[i])
    }
  }
  selectedDiceScore()

  totalPoints = roundPoints + points
  uncommitedPoints.innerHTML = totalPoints
}

// Hold dice
const holdPlayerSwitch = () => {
  if (dice_pos1.src.endsWith("blank_dice.png") === false) {
    if (activePlayer_1.classList[1] === 'active') {
      pointsPlayer1 += roundPoints + points
      valuePlayer_1.innerHTML = pointsPlayer1
    } else {
      pointsPlayer2 += roundPoints + points
      valuePlayer_2.innerHTML = pointsPlayer2
    }
  
    for (i = 0; i < dice_positions.length; i++) {
      dice_positions[i].classList.remove("select");
      dice_positions[i].src = diceImageBlank
    }
  
    activePlayer_1.classList.toggle("active");
    activePlayer_2.classList.toggle("active");
  
    diceAvailable = []
    ignoreRoll = []
    diceSelected = [];
    uncommitedPoints.innerHTML = 0
    roundPoints = 0
    playerTurnFirstRoll = true
  }
}

// Game Points Logic
const selectedDiceScore = () => {
  let freqObj = {}
  let freqObjKeyNamesArr = []
  points = 0
  diceLeadToPointsTemp = diceLeadToPoints

  if (dice_positions[0].src === diceImageBlank) {
    return points = 0
  } else {
    diceSelected.forEach(die => {
      if (freqObj[die]) {
        freqObj[die]++
      } else {
        freqObj[die] = 1
      }
    })
    freqObjKeyNamesArr= Object.keys(freqObj)
    // console.log(`Key Names: ${freqObjKeyNamesArr}`)
    // console.log(`Object: ${freqObj["5"]}`)

    switch (true) {
      // 6 of a kind
      case freqObj[`${freqObjKeyNamesArr[0]}`] === 6:
        points += 3000
        break
      // Two triplets
      case freqObj[`${freqObjKeyNamesArr[0]}`] === 3 && freqObj[`${freqObjKeyNamesArr[1]}`] === 3:
        points += 2500
        break
      // 4-o-kind and a pair - two ways 4&2 or 2&4
      case freqObj[`${freqObjKeyNamesArr[0]}`] === 4 && freqObj[`${freqObjKeyNamesArr[1]}`] === 2:
        points += 1500
        break
      case freqObj[`${freqObjKeyNamesArr[0]}`] === 2 && freqObj[`${freqObjKeyNamesArr[1]}`] === 4:
        points += 1500
        break
      // three Pairs
      case freqObj[`${freqObjKeyNamesArr[0]}`] === 2 && freqObj[`${freqObjKeyNamesArr[1]}`] === 2 && freqObj[`${freqObjKeyNamesArr[2]}`] === 2:
        points += 1500
        break
      // straight 1-6
      case freqObjKeyNamesArr.length === 6:
        points += 1500
        break
      default:
        for (let i = 0; i < freqObjKeyNamesArr.length; i++) {
          switch (true) {
            // Ones freq less than three
            case freqObjKeyNamesArr[i] == 1 && freqObj[`${freqObjKeyNamesArr[i]}`] < 3:
              points += freqObj[`${freqObjKeyNamesArr[i]}`] * 100
              continue
            // fives freq less than three
            case freqObjKeyNamesArr[i] == 5 && freqObj[`${freqObjKeyNamesArr[i]}`] < 3:
              points += freqObj[`${freqObjKeyNamesArr[i]}`] * 50
              continue
            // 5-o-kind
            case freqObj[`${freqObjKeyNamesArr[i]}`] === 5:
              points += 2000
              continue
            // 4-o-kind
            case freqObj[`${freqObjKeyNamesArr[i]}`] === 4:
              points += 1000
              continue
            // 3-o-kind
            case freqObj[`${freqObjKeyNamesArr[i]}`] === 3:
              // three ones
              if (freqObjKeyNamesArr[i] == 1 ) {
                points += 300
                dieLeadToPointsBoolean.threeOfKind(1)
                continue
              // three x
              } else {
                dieValue = parseInt(freqObjKeyNamesArr[i])
                points += dieValue * 100
                dieLeadToPointsBoolean.threeOfKind(dieValue)
                console.log(diceLeadToPointsTemp)
                continue
              }
          }
        }
    }
    return points
  }
}

// Creating boolean array - Did dice lead to points

const dieLeadToPointsBoolean = {
  threeOfKind: x => {
    for (let i = 0; i < dice.length; i++) {
      if (dice[i] === x && document.getElementById(`dice-pos${i+1}`).classList[1] === 'select' && document.getElementById(`dice-pos${i+1}`).classList[2] !== 'lock') {
        diceLeadToPointsTemp[i] = true
      }
    }
  }
}


// Reset


// --- Event listeners ---
// Roll dice
rollButton.addEventListener("click", () => {
  if (points !== 0 || playerTurnFirstRoll) {
    diceLeadToPoints = diceLeadToPointsTemp
    for (let i = 0; i < diceLeadToPoints.length; i++) {
      if (diceLeadToPoints[i] === false) {
        document.getElementById(`dice-pos${i+1}`).classList.remove('select')
      } 
    }
    rollAvailableDice()
  }
});

// Hold
holdButton.addEventListener("click", () => {
  holdPlayerSwitch()
  for (let i = 0; i < dice_positions.length; i++) {
    dice_positions[i].classList.remove("lock")
  }
});

// Select Die
for (let i = 0; i < dice_positions.length; i++) {
  dice_positions[i].addEventListener('click', () => {
    if (dice_pos1.src.endsWith("blank_dice.png") === false && dice_positions[i].classList[2] !== 'lock') {
      dice_positions[i].classList.toggle("select") 
      diceCheck()
    }
  })
}