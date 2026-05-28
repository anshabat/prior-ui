module.exports = {
  root: true,
  env: {
    node: true,
    es2024: true,
  },
  parserOptions: {
    sourceType: "script",
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist"],
};
