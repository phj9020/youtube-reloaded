const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// console.log(__dirname);

module.exports = {
    entry: {
        main: "./src/frontend/js/main.js",
        videoPlayer: "./src/frontend/js/videoPlayer.js"
    },
    mode: 'development',
    watch: true,
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, 'assets'),
        clean: true,
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    module: {
        rules:[
            {   
                test: /\.js$/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                  // use MiniCssExtractPlugin
                    MiniCssExtractPlugin.loader,
                  // Translates CSS into CommonJS
                    "css-loader",
                  // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
};