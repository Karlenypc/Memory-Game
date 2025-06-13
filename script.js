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
  { name: "farmer", image: "Farm-Icons/agricultor.png" },
  { name: "pumpkin", image: "Farm-Icons/calabaza.png" },
  { name: "wheelbarrow", image: "Farm-Icons/carretilla.png" },
  { name: "beeHoney", image: "Farm-Icons/colmena.png" },
  { name: "scarecrow", image: "Farm-Icons/espantapajaros.png" },
  { name: "sunflower", image: "Farm-Icons/flor.png" },
  { name: "fruits", image: "Farm-Icons/frutas.png" },
  { name: "farm", image: "Farm-Icons/granja.png" },
  { name: "eggs", image: "Farm-Icons/huevos.png" },
  { name: "milk", image: "Farm-Icons/leche.png" },
  { name: "hose", image: "Farm-Icons/manguera.png" },
  { name: "sheep", image: "Farm-Icons/oveja.png" },
  { name: "shovel", image: "Farm-Icons/pala.png" },
  { name: "wateringCan", image: "Farm-Icons/regadera.png" },
  { name: "seeds", image: "Farm-Icons/semillas.png" },
  { name: "tractor", image: "Farm-Icons/tractor.png" },
  { name: "cow", image: "Farm-Icons/vaca.png" },
  { name: "weatherVane", image: "Farm-Icons/veleta.png" }
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

const matrixGenerator = (cardValues, size = 4) => {
  //first we need to resets the game content
  gameContainer.innerHTML = "";

  /*with the spread operator we duplicate the randomly selected contents of the array, 
  creating a new array that contains two copies of each element.*/
  cardValues = [...cardValues, ...cardValues];

  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5); 

  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
    */

    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/>
        </div>
     </div>
     `;
  }

//Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  
//Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      /*If selected card is not matched yet then only run 
      (otherwise if it is already matched card when clicked would be ignored)*/
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");

        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current card value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");

        } else {
          //call the arrow function to increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");

          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            //set firstCard to false since next card would be first now
            firstCard = false;

            //winCount increment as user found a correct match
            winCount += 1;

            //check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame(); 
            }

          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;

            //this native JavaScript function allows the user to visualize the cards for 0,9seg before the cards are flipped again
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

const startGame = () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;

  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");

  //Start timer
  interval = setInterval(timeGenerator, 1000);

  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
}; 

const stopGame = () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
};

//Start game
startButton.addEventListener("click", startGame);

//Stop game
stopButton.addEventListener("click", stopGame);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};