import baseConfig from '@repo/lint-staged-config/base'

export default {
  ...baseConfig,
  '**/*!(package*).{js,json}': ['prettier --write'],
}
