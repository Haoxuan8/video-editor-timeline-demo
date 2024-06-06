module.exports = {
    content: {
        relative: true,
        files: [
            "./src/**/*.{js,jsx,ts,tsx}",
        ]
    },
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {
            zIndex: {
                "9999": "9999",
                "9998": "9998",
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
