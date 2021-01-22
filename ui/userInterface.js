import CategoriesFetcher from "../service/categoriesFetcher";

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
        this.timerSec = 1;
    }

    async populateCategories() {
        await this.categoriesFetcher.fetchCategories()
            .then(response => {response.forEach(obj => {
                let option = document.createElement("option");
                option.text = obj.name;
                option.value = obj.id;
                categories.add(option);
            });
        });
    }

    async populateQuestionNums() {
        for(let i=5; i<26; i++) {
            let option = document.createElement("option");
            option.text = i;
            option.value = i;
            questionsNum.add(option);
        }
    }

    async preparePropertiesScreen() {
        properties.classList.remove("hide");
        summaryDiv.classList.add("hide");
        summaryAnswersDiv.classList.add("hide");
        summaryAnswersDiv.innerHTML = "";
    }

    async prepareQuestionScreen() {
        properties.classList.add("hide");
        progressBar.classList.remove("hide");
        questions.classList.remove("hide");
    }

    async prepareQuestionsScreenWhenReplay() {
        summaryDiv.classList.add("hide");
        summaryAnswersDiv.classList.add("hide");
        summaryAnswersDiv.innerHTML = "";
    }

    async prepareSummaryScreen(questions, gameDetails) {
        progressBar.classList.add("hide");
        questionsDiv.classList.add("hide");
        summaryDiv.classList.remove("hide");
        summaryAnswersDiv.classList.remove("hide");
        this.createAnswersSummary(questions);
        this.displayGameDetails(gameDetails);
    }

    async showQuestion(question, questionNum, currentQuestionNum) {
        questionDiv.innerHTML = question.question;
        let allAnswers = this.getAllAnswers(question);
        questionForm.innerHTML = "";
        this.createAnswers(allAnswers);
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

    createRadioBox(answer, id) {
        let radiobox = document.createElement('input');
        radiobox.id = id;
        radiobox.type = 'radio';
        radiobox.value = answer;
        radiobox.name = "answer"
        return radiobox;
    }

    createLabel(answer, id) {
        const label = document.createElement('label')
        label.htmlFor = id;
        const description = document.createTextNode(answer);
        label.appendChild(description);
        return label;
    }

    createAnswerGroup(radiobox, label) {
        const answerGroup = document.createElement("div");
        answerGroup.classList.add("answerGroup");
        
        answerGroup.appendChild(radiobox);
        answerGroup.appendChild(label);
        return answerGroup;
    }

    getAllAnswers(question) {
        const allAnswers = question.incorrectAnswers;
        allAnswers.push(question.correctAnswer);
        this.shuffleArray(allAnswers);
        return allAnswers;
    }

    createAnswers(allAnswers) {
        let radioboxId = 0;
        allAnswers.forEach(answer => {
            const radiobox = this.createRadioBox(answer, radioboxId);
            const label = this.createLabel(answer, radioboxId);
            const answerGroup = this.createAnswerGroup(radiobox, label);
            questionForm.appendChild(answerGroup);
            radioboxId++;
        });
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

    createAnswersSummary(questions) {
        questions.forEach(question => {
            const scoreSectionScore = this.createScoreSection("Score:", question.answerDetails.score);
            const answerTime = question.answerDetails.answerTime;
            const scoreSectionTime = this.createScoreSection("Time:", `${Math.floor(answerTime/1000)}s`);
            const summaryInfo = this.createSummaryInfo(scoreSectionScore, scoreSectionTime);
            const answerDetails = this.createAnswerDetails(summaryInfo, question);
            summaryAnswersDiv.appendChild(answerDetails);
        });
        
    }

    createAnswerDetails(summaryInfo, question) {
        const answerDetails = this.getDiv("summaryDiv", "");
        answerDetails.appendChild(this.getDiv("question", question.question));
        answerDetails.appendChild(this.getHr());
        answerDetails.appendChild(this.getDiv("question", "Your answer: " + question.answerDetails.answer));
        answerDetails.appendChild(this.getHr());
        answerDetails.appendChild(this.getDiv("question", "Correct answer: " + question.correctAnswer));
        answerDetails.appendChild(this.getHr());
        answerDetails.appendChild(summaryInfo);
        return answerDetails;
    }

    createSummaryInfo(sectionScore, sectionTime) {
        const summaryInfo = this.getDiv("summaryInfoDiv", "");
        summaryInfo.appendChild(sectionScore);
        summaryInfo.appendChild(sectionTime);
        return summaryInfo;
    }

    createScoreSection(labelName, value) {
        const label = this.getLabel(labelName);
        const valueDiv = this.getDiv("answerScore", value);
        const scoreSection = this.getDiv("scoreSection", "");
        scoreSection.appendChild(label);
        scoreSection.appendChild(valueDiv);
        return scoreSection;
    }

    getHr() {
        return document.createElement("hr");
    }

    getDiv(className, innerHTML) {
        const div = document.createElement("div");
        div.classList.add(className);
        div.innerHTML = innerHTML;
        return div;
    }

    getLabel(innerHTML) {
        const label = document.createElement("label");
        label.innerHTML = innerHTML;
        return label;
    }

    startQuestionTimer() {
        const minutes = Math.floor(this.timerSec/60);
        timerDiv.innerHTML = minutes + ":" + this.timerSec%60;
        this.timerSec ++;
    }
}