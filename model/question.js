export default class Question {
    constructor(responseObj) {
        this.category = responseObj.category;
        this.type = responseObj.type;
        this.difficulty = responseObj.difficulty;
        this.question = responseObj.question;
        this.correctAnswer = responseObj.correct_answer;
        this.incorrectAnswers = responseObj.incorrect_answers;
        this.answerDetails = {};
    }

    setAnswerDetails(answerDetails) {
        this.answerDetails = answerDetails;
    }
}