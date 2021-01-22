import Game from "./game/game";

const playButton = document.getElementById("playButton");
const answerButton = document.getElementById("answerButton");
const skipButton = document.getElementById("skipButton");
const playAgainButton = document.getElementById("playAgainButton");
const newGameButton = document.getElementById("newGameButton");

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