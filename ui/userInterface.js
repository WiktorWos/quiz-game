import CategoriesFetcher from "../service/categoriesFetcher";

const categories = document.getElementById("category");
const questionsNum = document.getElementById("quantity");
const properties = document.getElementById("properties");
const progressBar = document.getElementById("progressBar");
const questions = document.getElementById("questions");
const questionDiv = document.getElementById("question");
const questionForm = document.forms["questionForm"];

export default class UserInterface {
    constructor() {
        this.categoriesFetcher = new CategoriesFetcher();
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

    async prepareQuestionScreen() {
        properties.classList.add("hide");
        progressBar.classList.remove("hide");
        questions.classList.remove("hide");
    }

    async showQuestion(question, questionNum, currentQuestionNum) {
        questionDiv.innerHTML = question.question;
        let allAnswers = this.getAllAnswers(question);
        questionForm.innerHTML = "";
        this.createAnswers(allAnswers);
        this.increseProgressBar(questionNum, currentQuestionNum)
    }

    increseProgressBar(questionNum, currentQuestionNum) {
        console.log(questionNum + " " + currentQuestionNum);
        const progressValue = document.getElementById("progressValue");
        const calculatedWidth = (currentQuestionNum / questionNum) * 100;
        const widthValue = calculatedWidth + "%";
        console.log(widthValue);
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

    createRadioBox(answer) {
        let radiobox = document.createElement('input');
        radiobox.type = 'radio';
        radiobox.value = answer;
        radiobox.name = "answer"
        return radiobox;
    }

    createLabel(answer) {
        let label = document.createElement('label')
        label.htmlFor = 'answer';
        let description = document.createTextNode(answer);
        label.appendChild(description);
        return label;
    }

    createAnswerGroup(radiobox, label) {
        let answerGroup = document.createElement("div");
        answerGroup.classList.add("answerGroup");
        
        answerGroup.appendChild(radiobox);
        answerGroup.appendChild(label);
        return answerGroup;
    }

    getAllAnswers(question) {
        let allAnswers = question.incorrectAnswers;
        allAnswers.push(question.correctAnswer);
        this.shuffleArray(allAnswers);
        return allAnswers;
    }

    createAnswers(allAnswers) {
        allAnswers.forEach(answer => {
            let radiobox = this.createRadioBox(answer);
            let label = this.createLabel(answer);
            let answerGroup = this.createAnswerGroup(radiobox, label);
            questionForm.appendChild(answerGroup);
        });
    }

    getSelectedRadioValue() {
        let selectedAnswer;
        questionForm["answer"].forEach(answer => {
            if(answer.checked) selectedAnswer = answer.value;
        });
        return selectedAnswer;
    }
}