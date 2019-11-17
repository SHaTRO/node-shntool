module.exports = {
  env: {
    browser: false,
    node: true,
  },
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",

    // Brace Style (one true brace style, with single line allowed)
    "brace-style": "off",
    "@typescript-eslint/brace-style": [ "error", "1tbs", {
      "allowSingleLine": true
    }],

    // 2 space indent, no tabs
    "indent": "off",
    "@typescript-eslint/indent": [ "error", 2 ],
    "@typescript-eslint/no-empty-interface": [ "off" ]
  },
}