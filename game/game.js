import AnswerDetails from "../model/answerDetails"
import QuestionsFetcher from "../service/questionsFetcher";
import Question from "../model/question";
import UserInterface from "../ui/userInterface";
import Timer from "./timer";

const propertiesForm = document.forms["propertiesForm"];
const bonusTime = 5000;

export default class Game {
    constructor() {
        this.questions = [];
        this.currentQuestionNum = -1;
        this.userInterface = new UserInterface();
        this.questionFetcher = new QuestionsFetcher();
        this.questionTimer = {};
        this.totalScore = 0;
    }

    async startGame() {
        this.userInterface.populateCategories();
        this.userInterface.populateQuestionNums();
    }
        
    async submitProperties() {
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
        }
    }

    startTimer() {
        this.questionTimer = new Timer();
        return timer;
    }

    answer() {
        const answer = this.userInterface.getSelectedRadioValue();
        const time = this.questionTimer.getMilisecondsFromStart();
        const correctAnswer = this.questions[this.currentQuestionNum].correctAnswer;
        const score = this.calculateScore(answer, correctAnswer, time);
        this.totalScore += score;
        const answerDetails = new AnswerDetails(time, true, answer, score);
        this.questions[this.currentQuestionNum].setAnswerDetails(answerDetails);
        this.loadNextQuestion();
    }

    skip() {
        const score = 0;
        const time = this.questionTimer.getMilisecondsFromStart();
        const answerDetails = new AnswerDetails(time, false, "", score);
        this.questions[this.currentQuestionNum].setAnswerDetails(answerDetails);
        this.loadNextQuestion();
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