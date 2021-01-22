export default class QuestionsFetcher {
    async fetchQuestions(questionsNum, category, difficulty) {
        const apiURL = `https://opentdb.com/api.php?amount=${questionsNum}&category=${category}&difficulty=${difficulty}&type=multiple`;
        return fetch(apiURL)
            .then(response => response.json()) 
            .then(data=>{
                return data.results;
            })
            .catch(error => alert(error));
    }
}