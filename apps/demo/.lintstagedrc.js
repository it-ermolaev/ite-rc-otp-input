const base = require("@repo/lint-staged");

module.exports = {
  ...base,
  "{src}/**/*.{ts, tsx}": [() => "npm run check-types", "npm run lint:fix"],
};
