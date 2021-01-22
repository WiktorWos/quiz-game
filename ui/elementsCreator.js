const summaryAnswersDiv = document.getElementById("answersSummary");
const questionForm = document.forms["questionForm"];

export default class ElementsCreator {
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
}