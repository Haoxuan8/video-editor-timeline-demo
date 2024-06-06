const isDev = process.env.NODE_ENV === "development";

module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            [
                "@babel/preset-env",
                {
                    useBuiltIns: "usage",
                    corejs: 3,
                },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
        ],
        plugins: [
            isDev && "react-refresh/babel",
        ].filter(Boolean),
    };
};
