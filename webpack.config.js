const {resolve} = require("path");

module.exports = {
    mode: "production",
    entry: "./quizGame.js",
    output: {
        filename: "bundle.js",
        path: resolve(__dirname, "dist")
    },
    devtool: 'eval-source-map'
}