const base = require("@repo/lint-staged");

module.exports = {
  ...base,
  "{src}/**/*.ts": [() => "npm run check-types", "npm run lint:fix"],
};
