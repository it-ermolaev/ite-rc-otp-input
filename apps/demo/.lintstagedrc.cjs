const appConfig = require('@repo/lint-staged-config/app')
const baseConfig = require('@repo/lint-staged-config/base')

module.exports = {
  ...appConfig,
  ...baseConfig,
}
