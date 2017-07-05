module.exports = {
    parser: 'babel-eslint',
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          "jsx": true
        }
    },
    plugins: [
        "react"
    ],
    rules: {
        indent: ["error", 2],
    }
}
