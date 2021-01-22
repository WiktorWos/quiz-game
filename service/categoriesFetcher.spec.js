import CategoriesFetcher from "./categoriesFetcher";


describe("categoriesFetcher", () => {
    let fetcher;
    global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ trivia_categories: [{ "id": 9, "name": "cat1" }] }),
        })
    );

    beforeEach(() => {
        fetcher = new CategoriesFetcher()
        fetch.mockClear();
    });

    describe("fetchCategories()", () => {
        it("finds categories", async () => {
            const trivia_categories = await fetcher.fetchCategories();
          
            expect(trivia_categories).toEqual([{ "id": 9, "name": "cat1" }]);
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it("returns null when exception", async () => {
            window.alert = jest.fn();
            fetch.mockImplementationOnce(() => Promise.reject("API is down"));
          
            const trivia_categories = await fetcher.fetchCategories();
          
            expect(trivia_categories).toEqual(null);
            expect(fetch).toHaveBeenCalled();
          });
    });
});
