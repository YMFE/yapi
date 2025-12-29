module.exports = {
    env: {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parser: "babel-eslint",
    parserOptions: {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    plugins: [
        "react",
        "import"
    ],
    settings: {
        react: {
            version: "16.2"
        }
    },
    rules: {
        "indent": ["off", 2],
        "react/display-name": ["off"],
        "react/jsx-indent": ["error", 2],
        "react/no-deprecated": ["off"],
        "comma-dangle": ["error", "never"],
        "no-console": ["off"],
        "import/no-unresolved": ["off"],
        "react/no-find-dom-node": ["off"],
        "no-empty": ["off"]
        // "react/no-unescaped-entities": 0
    }
};
