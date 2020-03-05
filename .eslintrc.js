module.exports = {
  env: {
    browser: true,
	es6: true,
	node: true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
	"indent": ["error", "tab"],
	"no-tabs": 0,
	"global-require": "error",
	"linebreak-style": 0,
	"eslint linebreak-style": [0, "error", "windows"],
  },
};
