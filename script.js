const dice = [
  {
    dice_num: 1,
    dice_img: "/images/1_dice.png",
  },
  {
    dice_num: 2,
    dice_img: "/images/2_dice.png",
  },
  {
    dice_num: 3,
    dice_img: "/images/3_dice.png",
  },
  {
    dice_num: 4,
    dice_img: "/images/4_dice.png",
  },
  {
    dice_num: 5,
    dice_img: "/images/5_dice.png",
  },
  {
    dice_num: 6,
    dice_img: "/images/6_dice.png",
  },
];

const dice_position = [
  { diceP1: document.querySelector("dice-pos1") },
  { diceP2: document.querySelector("dice-pos2") },
  { diceP3: document.querySelector("dice-pos3") },
  { diceP4: document.querySelector("dice-pos4") },
  { diceP5: document.querySelector("dice-pos5") },
  { diceP6: document.querySelector("dice-pos6") },
];

// const dice_1 = document.querySelector("dice-pos1");
// const dice_2 = document.querySelector("dice-pos2");
// const dice_3 = document.querySelector("dice-pos3");
// const dice_4 = document.querySelector("dice-pos4");
// const dice_5 = document.querySelector("dice-pos5");
// const dice_6 = document.querySelector("dice-pos6");

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollAvailableDice() {
  for (let i = 0; (x = dice_position.length - 1); i++) {
    x;
  }
}

// function holdDice() {}

// function selectDiceHold() {}
