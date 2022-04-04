const rollButton = document.getElementById("roll-button");
const holdButton = document.getElementById("hold-button");
const diceAll = document.querySelectorAll("dice");
const activePlayer_1 = document.getElementById("player1");
const activePlayer_2 = document.getElementById("player2");

const dice = [
  {
    dice_num: 1,
    dice_img: "./images/1_dice.png",
  },
  {
    dice_num: 2,
    dice_img: "./images/2_dice.png",
  },
  {
    dice_num: 3,
    dice_img: "./images/3_dice.png",
  },
  {
    dice_num: 4,
    dice_img: "./images/4_dice.png",
  },
  {
    dice_num: 5,
    dice_img: "./images/5_dice.png",
  },
  {
    dice_num: 6,
    dice_img: "./images/6_dice.png",
  },
];

const dice_position = [
  document.getElementById("dice-pos1"),
  document.getElementById("dice-pos2"),
  document.getElementById("dice-pos3"),
  document.getElementById("dice-pos4"),
  document.getElementById("dice-pos5"),
  document.getElementById("dice-pos6"),
];

// Functions

const rollDie = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const rollAvailableDice = () => {
  let tempRoll = rollDie();

  for (let i = 0; i < dice_position.length; i++) {
    if (dice_position[i].classList.value === "dice select") {
      continue;
    } else {
      dice_position[i].src = dice[tempRoll - 1]["dice_img"];
      tempRoll = rollDie();
    }
  }
};

// Roll dice
rollButton.addEventListener("click", rollAvailableDice());

// Select Die

dice_position[0].addEventListener("click", () => {
  dice_position[0].classList.toggle("select");
});
dice_position[1].addEventListener("click", () => {
  dice_position[1].classList.toggle("select");
});
dice_position[2].addEventListener("click", () => {
  dice_position[2].classList.toggle("select");
});
dice_position[3].addEventListener("click", () => {
  dice_position[3].classList.toggle("select");
});
dice_position[4].addEventListener("click", () => {
  dice_position[4].classList.toggle("select");
});
dice_position[5].addEventListener("click", () => {
  dice_position[5].classList.toggle("select");
});

// holdButton.addEventListener("click", () => {
//   for (i = 0; i < dice_position.length; i++) {
//     dice_position[i].classList.remove("select");
//   }

//   activePlayer_1.classList.toggle("active");
//   activePlayer_2.classList.toggle("active");
// });
