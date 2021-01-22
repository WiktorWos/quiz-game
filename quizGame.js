import Game from "./game/game";

const playButton = document.getElementById("playButton");
const answerButton = document.getElementById("answerButton");
const skipButton = document.getElementById("skipButton");
const playAgainButton = document.getElementById("playAgainButton");
const newGameButton = document.getElementById("newGameButton");
const timerDiv = document.getElementById("timer");

function startGame() {
    const game = new Game();
    game.startGame();
    playButton.addEventListener("click", () => game.submitProperties());
    answerButton.addEventListener("click", () => game.answer(true));
    skipButton.addEventListener("click", () => game.answer(false));
    playAgainButton.addEventListener("click", () => game.playAgain());
    newGameButton.addEventListener("click", () => game.startNewGame());
    const questionTimer = setInterval(() => game.startVisibleTimer(), 1000);
}

startGame();



// var questionTimer = setInterval(timer, 1000);
// var sec = 0;
// function timer() {
//     let minutes = Math.floor(sec/60);
//     timerDiv.innerHTML = minutes + ":" + sec%60;
//     sec ++;
// }