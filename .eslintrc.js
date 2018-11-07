module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "node": true
  },
  "globals": {
    "ENV": true,
    "PORT": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "rules": {
      "indent": [
          "error",
          2
      ],
      "linebreak-style": [
          "error",
          "windows"
      ],
      "quotes": [
          "error",
          "double"
      ],
      "semi": [
          "error",
          "never"
      ],
      "no-console": 0,
      "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline"
      }]
  }
}
