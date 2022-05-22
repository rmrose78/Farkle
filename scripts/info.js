const rulesCtr = document.getElementById("rules--container");
const infoBtn = document.getElementById("info");
const closeBtn = document.getElementById("close-btn");
const resetBtn = document.getElementById("reset");

const toggleRules = () => {
  rulesCtr.classList.toggle("show");
};

const rulesOff = () => {
  rulesCtr.classList.remove("show");
};

const infoListeners = [
  [infoBtn, toggleRules],
  [closeBtn, toggleRules],
  [resetBtn, rulesOff],
];

infoListeners.forEach((listener) => {
  listener[0].addEventListener("click", listener[1]);
});
