import AnswerDetails from "../model/answerDetails"
import QuestionsFetcher from "../service/questionsFetcher";
import Question from "../model/question";
import UserInterface from "../ui/userInterface";
import Timer from "./timer";
import GameDetails from "../model/gameDetails";

const propertiesForm = document.forms["propertiesForm"];
const bonusTime = 5000;

export default class Game {
    constructor() {
        this.questions = [];
        this.currentQuestionNum = -1;
        this.userInterface = new UserInterface();
        this.questionFetcher = new QuestionsFetcher();
        this.questionTimer = {};
        this.gameDetails = {};
    }

    async startGame() {
        this.userInterface.populateCategories();
        this.userInterface.populateQuestionNums();
    }

    async playAgain() {
        this.prepareToNewGame();
        this.submitProperties();
        this.userInterface.prepareQuestionsScreenWhenReplay();
    }

    async startNewGame() {
        this.prepareToNewGame();
        this.userInterface.preparePropertiesScreen();
    }

    prepareToNewGame() {
        this.questions = [];
        this.currentQuestionNum = -1;
    }
        
    async submitProperties() {
        this.gameDetails = new GameDetails();
        const questionsNum = propertiesForm["quantity"].value;
        const category = propertiesForm["category"].value;
        const difficulty = propertiesForm["difficulty"].value;
        await this.saveQuestions(questionsNum, category, difficulty);
        this.userInterface.prepareQuestionScreen();
        this.loadNextQuestion();
    }

    async saveQuestions(questionsNum, category, difficulty) {
        await this.questionFetcher.fetchQuestions(questionsNum, category, difficulty)
            .then(response => {
                response.forEach(obj => {
                    this.questions.push(new Question(obj));
            });
        });
    }

    loadNextQuestion() {
        if(this.currentQuestionNum < this.questions.length) {
            this.currentQuestionNum ++;
            this.userInterface.showQuestion(this.questions[this.currentQuestionNum], this.questions.length, this.currentQuestionNum);
            this.startTimer();
            this.prepareVisibleTimer();
        }
    }

    prepareVisibleTimer() {
        this.userInterface.timerSec = 1;
        const timerDiv = document.getElementById("timer");
        timerDiv.innerHTML = "0:0";
    }

    startTimer() {
        this.questionTimer = new Timer();
        return timer;
    }

    startVisibleTimer() {
        this.userInterface.startQuestionTimer();
    }

    answer(isAnswered) {
        const answer = this.getAnswer(isAnswered);
        const isAnswerNotChecked = (isAnswered && answer =="");
        if(!isAnswerNotChecked) {
            this.setAnswerDetails(isAnswered, answer);
            this.setTotalScore();
            this.loadNextScreen();
        }
    }

    setAnswerDetails(isAnswered, answer) {
        const time = this.questionTimer.getMilisecondsFromStart();
        const correctAnswer = this.questions[this.currentQuestionNum].correctAnswer;
        let score = this.getScore(isAnswered, answer, correctAnswer, time);
        const answerDetails = new AnswerDetails(time, isAnswered, answer, score);
        this.questions[this.currentQuestionNum].setAnswerDetails(answerDetails);
    }

    getAnswer(isAnswered) {
        let answer = "";
        if(isAnswered) answer = this.userInterface.getSelectedRadioValue();
        return answer;
    }

    getScore(isAnswered, answer, correctAnswer, time) {
        let score = 0;
        if(isAnswered) score = this.calculateScore(answer, correctAnswer, time);
        return score;
    }

    setTotalScore() {
        const currentQuestion = this.questions[this.currentQuestionNum];
        const currentQuestionScore = currentQuestion.answerDetails.score;
        this.gameDetails.totalScore += currentQuestionScore;
    }

    loadNextScreen() {
        const lastQuestionNum = this.questions.length - 1;
        if(this.currentQuestionNum < lastQuestionNum) this.loadNextQuestion();
        else {
            this.userInterface.prepareSummaryScreen(this.questions, this.gameDetails);
        }
    }

    calculateScore(answer, correctAnswer, time) {
        let score = 0;
        if(answer === correctAnswer) {
            score += 1;
            if(time < bonusTime) score += 0.5;
        } else score -= 0.25;
        
        return score;
    }
}