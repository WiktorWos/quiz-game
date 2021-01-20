import Game from "./game/game";

const playButton = document.getElementById("playButton");
const answerButton = document.getElementById("answerButton");
const skipButton = document.getElementById("skipButton");
const timerDiv = document.getElementById("timer");

var game = new Game();
game.startGame();

playButton.addEventListener("click", event => game.submitProperties());
answerButton.addEventListener("click", event => game.answer());
skipButton.addEventListener("click", event => game.skip());

var questionTimer = setInterval(timer, 1000);
var sec = 0;
function timer() {
    let minutes = Math.floor(sec/60);
    timerDiv.innerHTML = minutes + ":" + sec%60;
    sec ++;
}