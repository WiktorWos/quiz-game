export default class Timer {
    constructor() {
        this.start = new Date();
    }

    getMilisecondsFromStart() {
        let stop = new Date();
        return stop.getTime() - this.start.getTime();
    }
}