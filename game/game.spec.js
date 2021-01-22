import Game from"./game";
import Question from "../model/question";
import AnswerDetails from "../model/answerDetails";

describe("game", () => {
    let game;
    beforeEach(() => game = new Game());

    describe("calculateScore()", () => {
        it("should return score for good answer without a bonus", () => {
            expect(game.calculateScore("a", "a", 8000)).toBe(1);
        });

        it("should return score for good answer with a bonus", () => {
            expect(game.calculateScore("a", "a", 8000)).toBe(1);
        });

        it("should return score for bad answer", () => {
            expect(game.calculateScore("a", "a", 8000)).toBe(1);
        });
    });

    describe("prepareToNewGame()", () => {
        it("should return score for good answer without a bonus", () => {
            game.questions = ['a', 'b'];
            game.currentQuestionNum = 1;
            game.prepareToNewGame();
            expect(game.questions).toStrictEqual([]);
            expect(game.currentQuestionNum).toStrictEqual(-1);
        });
    });

    describe("saveQuestions()", () => {
        it("should call service method", () => {
            game.questionFetcher.fetchQuestions = jest.fn();
            game.saveQuestions(5, 10, "easy");
            expect(game.questionFetcher.fetchQuestions).toHaveBeenCalled();
        });
    });

    describe("startGame()", () => {
        it("should call ui serivice methods", () => {
            game.userInterface.populateCategories = jest.fn();
            game.userInterface.populateQuestionNums = jest.fn();
            game.startGame();
            expect(game.userInterface.populateCategories).toHaveBeenCalled();
            expect(game.userInterface.populateQuestionNums).toHaveBeenCalled();
        });
    });

    describe("playAgain()", () => {
        it("should call ui service method", () => {
            game.userInterface.prepareQuestionsScreenWhenReplay = jest.fn();
            game.playAgain();
            expect(game.userInterface.prepareQuestionsScreenWhenReplay).toHaveBeenCalled();
        });
    });

    describe("loadNextQuestion()", () => {
        it("should load next question and increment current quesiton num", () => {
            game.currentQuestionNum = 0;
            game.questions.length = 5;
            game.userInterface.showQuestion = jest.fn();
            game.prepareVisibleTimer = jest.fn();
            game.loadNextQuestion();
            expect(game.userInterface.showQuestion).toHaveBeenCalled();
            expect(game.currentQuestionNum).toStrictEqual(1);
        });
    });

    describe("answer()", () => {
        it("answered, should update details", () => {
            game.getAnswer = jest.fn(() => "answer");
            game.setAnswerDetails = jest.fn();
            game.setTotalScore = jest.fn();
            game.loadNextScreen = jest.fn();
            game.answer(true);
            expect(game.setAnswerDetails).toHaveBeenCalled();
            expect(game.setTotalScore).toHaveBeenCalled();
            expect(game.loadNextScreen).toHaveBeenCalled();
        });

        it("answered with not checked button, should update details", () => {
            game.getAnswer = jest.fn(() => "");
            game.setAnswerDetails = jest.fn();
            game.setTotalScore = jest.fn();
            game.loadNextScreen = jest.fn();
            game.answer(true);
            expect(game.setAnswerDetails).not.toHaveBeenCalled();
            expect(game.setTotalScore).not.toHaveBeenCalled();
            expect(game.loadNextScreen).not.toHaveBeenCalled();
        });

        it("skipped", () => {
            game.getAnswer = jest.fn(() => "");
            game.setAnswerDetails = jest.fn();
            game.setTotalScore = jest.fn();
            game.loadNextScreen = jest.fn();
            game.answer(false);
            expect(game.setAnswerDetails).toHaveBeenCalled();
            expect(game.setTotalScore).toHaveBeenCalled();
            expect(game.loadNextScreen).toHaveBeenCalled();
        });
    });
});