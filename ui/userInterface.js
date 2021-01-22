import CategoriesFetcher from "../service/categoriesFetcher";
import ElementsCreator from "./elementsCreator";

const categories = document.getElementById("category");
const questionsNum = document.getElementById("quantity");
const properties = document.getElementById("properties");
const progressBar = document.getElementById("progressBar");
const questionsDiv = document.getElementById("questions");
const questionDiv = document.getElementById("question");
const summaryDiv = document.getElementById("summary");
const summaryAnswersDiv = document.getElementById("answersSummary");
const questionForm = document.forms["questionForm"];
const timerDiv = document.getElementById("timer");

export default class UserInterface {
    constructor() {
        this.categoriesFetcher = new CategoriesFetcher();
        this.elementsCreator = new ElementsCreator();
        this.timerSec = 1;
    }

    async populateCategories() {
        await this.categoriesFetcher.fetchCategories()
            .then(response => {response.forEach(obj => {
                const option = document.createElement("option");
                option.text = obj.name;
                option.value = obj.id;
                categories.add(option);
            });
        });
    }

    populateQuestionNums() {
        for(let i=5; i<26; i++) {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            if(i==10) option.selected ="selected";
            questionsNum.add(option);
        }
    }

    preparePropertiesScreen() {
        properties.classList.remove("hide");
        summaryDiv.classList.add("hide");
        summaryAnswersDiv.classList.add("hide");
        summaryAnswersDiv.innerHTML = "";
    }

    prepareQuestionScreen() {
        properties.classList.add("hide");
        progressBar.classList.remove("hide");
        questions.classList.remove("hide");
    }

    prepareQuestionsScreenWhenReplay() {
        summaryDiv.classList.add("hide");
        summaryAnswersDiv.classList.add("hide");
        summaryAnswersDiv.innerHTML = "";
    }

    prepareSummaryScreen(questions, gameDetails) {
        progressBar.classList.add("hide");
        questionsDiv.classList.add("hide");
        summaryDiv.classList.remove("hide");
        summaryAnswersDiv.classList.remove("hide");
        this.elementsCreator.createAnswersSummary(questions);
        this.displayGameDetails(gameDetails);
    }

    showQuestion(question, questionNum, currentQuestionNum) {
        questionDiv.innerHTML = question.question;
        const allAnswers = this.getAllAnswers(question);
        questionForm.innerHTML = "";
        this.elementsCreator.createAnswers(allAnswers);
        this.increseProgressBar(questionNum, currentQuestionNum)
    }

    increseProgressBar(questionNum, currentQuestionNum) {
        const progressValue = document.getElementById("progressValue");
        const calculatedWidth = (currentQuestionNum / questionNum) * 100;
        const widthValue = calculatedWidth + "%";
        progressValue.style.width = widthValue;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    getAllAnswers(question) {
        const allAnswers = question.incorrectAnswers;
        allAnswers.push(question.correctAnswer);
        this.shuffleArray(allAnswers);
        return allAnswers;
    }

    getSelectedRadioValue() {
        let selectedAnswer = "";
        questionForm["answer"].forEach(answer => {
            if(answer.checked) selectedAnswer = answer.value;
        });
        if(selectedAnswer === "") alert("Please select an answer or skip the question.")
        return selectedAnswer;
    }

    displayGameDetails(gameDetails) {
        const totalScore = document.getElementById("totalScore");
        const totalTime = document.getElementById("totalTime");
        const timeInMilis = gameDetails.totalTimer.getMilisecondsFromStart();
        const timeInsSec = Math.floor(timeInMilis/1000);
        totalScore.innerHTML = gameDetails.totalScore;
        totalTime.innerHTML = `${Math.floor(timeInsSec/60)}:${timeInsSec%60}`;
    }

    startQuestionTimer() {
        const minutes = Math.floor(this.timerSec/60);
        timerDiv.innerHTML = minutes + ":" + this.timerSec%60;
        this.timerSec ++;
    }
}