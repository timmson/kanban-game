const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const outputDir = path.resolve(__dirname, "./docs");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: outputDir,
		filename: "index.js"
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
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

	],
	devServer: {
		static: {
			directory: outputDir,
		},
		compress: true,
		port: 3000
	}
};
