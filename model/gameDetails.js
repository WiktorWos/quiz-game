import Timer from "../game/timer";

export default class GameDetails {
    constructor() {
        this.totalTimer = new Timer();
        this.totalScore = 0;
    }
}