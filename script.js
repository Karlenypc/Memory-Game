const moves = document.getElementById("moves-count");
const timeCount = document.getElementById("time-count");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Object's Array  
const farmItems = [
  { name: "farmer", image: "agricultor.png" },
  { name: "pumpkin", image: "calabaza.png" },
  { name: "wheelbarrow", image: "carretilla.png" },
  { name: "beeHoney", image: "colmena.png" },
  { name: "scarecrow", image: "espantapajaros.png" },
  { name: "sunflower", image: "flor.png" },
  { name: "fruits", image: "frutas.png" },
  { name: "farm", image: "granja.png" },
  { name: "eggs", image: "huevos.png" },
  { name: "milk", image: "leche.png" },
  { name: "hose", image: "manguera.png" },
  { name: "sheep", image: "oveja.png" },
  { name: "shovel", image: "pala.png" },
  { name: "wateringCan", image: "regadera.png" },
  { name: "seeds", image: "semillas.png" },
  { name: "tractor", image: "tractor.png" },
  { name: "cow", image: "vaca.png" },
  { name: "weatherVane", image: "veleta.png" }
];

//Initial Time
let seconds = 0; 
let minutes = 0;

//Initial moves & win count
let movesCount = 0;
let winCount = 0;

//Arrow Function for the timer
const timeGenerator = () => {
  seconds += 1;

  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;

  /*NOTE: logic for ternary operators 
  => condition ? true_value : false_value; */

  timeCount.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Arrow Function for calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array with spread operator
  let tempArray = [...farmItems];

  //initializes cardValues array
  let cardValues = [];
  
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2; // 8 unique cards

  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);

    //once selected remove the object from temp array so it doesn't repeat
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};
