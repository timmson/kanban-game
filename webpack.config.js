const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, './'),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader , "css-loader"]
            }
        ]
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.css"
        })

    ]
};