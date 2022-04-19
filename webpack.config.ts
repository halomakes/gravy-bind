import * as path from 'path';
import { Configuration } from 'webpack';
const config: Configuration = {
    entry: './src/browser.ts',
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist.browser'),
        filename: 'index.js',
    }
};
export default config;