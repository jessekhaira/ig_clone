module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "airbnb-typescript/base",
        "plugin:prettier/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2020,
        "tsconfigRootDir": __dirname, 
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-console": ["error", {"allow": ["warn", "error"] }],
        "no-void": "off",
        'max-len': [
            2,
            {
                code: 80,
                ignoreUrls: true,
                ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
                ignorePattern: '../[\\w]+/.+',
            },
        ],
    }
}
