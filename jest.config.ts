import shell from 'shelljs';
import type { Config } from '@jest/types';

const projects = shell
  .ls('packages')
  .map(pkg => {
    return [
      {
        displayName: `@${pkg}/small`,
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: [`<rootDir>/packages/${pkg}/**/*.small.ts?(x)`],
      },
      {
        displayName: `@${pkg}/medium`,
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: [`<rootDir>/packages/${pkg}/**/*.medium.ts?(x)`],
      },
    ];
  })
  .flat(1);

const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  testTimeout: 8000,
  projects,
};

export default config;
