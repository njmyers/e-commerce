/* eslint-env node*/
const pkg = require('./package.json');
const { baseConfig } = require('../../jest.config.base');

const backendSmall = {
  ...baseConfig,
  displayName: `${pkg.name}/small`,
  rootDir: '../../',
  testMatch: ['<rootDir>/packages/backend/**/*.small.test.ts'],
};

const backendMedium = {
  ...baseConfig,
  displayName: `${pkg.name}/medium`,
  rootDir: '../../',
  testMatch: ['<rootDir>/packages/backend/**/*.medium.test.ts'],
};

module.exports = {
  projects: [backendSmall, backendMedium],
};
