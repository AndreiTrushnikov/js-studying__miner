const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
    entry: './src/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: '[name][ext]',
        clean: true
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 5001,
        open: true,
        hot: true,
        static: {
            directory: __dirname + '/dist',
        },
    },
    module: {
        rules: [
            //css
            {
                test: /\.css$/, use: ['style-loader', 'css-loader']
            },
            //images
            {
                test: /.(svg|ico|png|webp|jpg|gif|jpeg)$/,
                type: 'asset/resource'
            },
            // javascript for babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new RemovePlugin({
            before: {
                root: './dist'
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Miner 9*9 = 10 mines',
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/index.html')
        }),
    ],
    resolve: {
        extensions: ['.js']
    }
};