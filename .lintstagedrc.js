const baseConfig = require('@repo/lint-staged-config/base')

module.exports = {
  ...baseConfig,
  '**/*!(package*).{js,json}': ['prettier --write'],
}
