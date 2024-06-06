const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

const postcssOpts = {
    postcssOptions: {
        plugins: [
            tailwindcss("./tailwind.config.js"),
            autoprefixer,
        ],
    },
};

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        index: "./src/index.tsx",
    },
    output: {
        path: `${__dirname}/build`,
        publicPath: process.env.NODE_ENV === "production"
            ? "./"
            : "/",
        filename: () => {
            return isDev
                ? "[name].js"
                : "[name].[chunkhash].js";
        },
        chunkFilename: isDev
            ? "[name].js"
            : "[name].[chunkhash].js",
        assetModuleFilename: "asset/[contenthash][ext][query]",
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: `${__dirname}/src/index.html`,
            chunks: ["index"],
            inject: true,
        }),
        !isDev && new CleanWebpackPlugin(),
        isDev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),

    module: {
        rules: [
            {
                test: /\.(js|ts(x?))$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.scss$/i,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: postcssOpts,
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: postcssOpts,
                    },
                ],
            },
            {
                test: /\.css$/i,
                include: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.svg$/i,
                exclude: /node_modules/,
                use: ["@svgr/webpack"],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset",
            },
        ],
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": `${__dirname}/src`,
        },
    },

    devServer: {
        port: 8090,
    },
};
