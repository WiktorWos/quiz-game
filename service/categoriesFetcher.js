export default class CategoriesFetcher {
    async fetchCategories() {
        const apiURL = "https://opentdb.com/api_category.php";
        return fetch(apiURL)
            .then(response => response.json()) 
            .then(data=>{
                return data.trivia_categories;
            });
    }
}