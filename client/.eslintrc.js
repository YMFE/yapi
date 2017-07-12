module.exports = {
    parser: 'babel-eslint',
    extends: ["eslint:recommended", "plugin:react/recommended"],
    "env": {
      "browser": true
    },
    parserOptions: {
        "sourceType": 'module',
        "ecmaFeatures": {
          "jsx": true
        }
    },
    plugins: [
        "react",
        "import"
    ],
    rules: {
        "indent": ["error", 2, { "SwitchCase": 1 }],
        "react/display-name": ["off"],
        "react/jsx-indent": ["error", 2],
        "comma-dangle": ["error", "only-multiline"],
        "no-console": ["off"],
        "import/no-unresolved": ["error"]
    }
}
