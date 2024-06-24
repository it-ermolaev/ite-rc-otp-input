const baseConfig = require("@repo/lint-staged/base");
const clientConfig = require("@repo/lint-staged/client");

module.exports = {
  ...baseConfig,
  ...clientConfig,
};
