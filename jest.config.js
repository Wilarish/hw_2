/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  rootDir: './src',
  testRegex: '.e2e.tests.ts$'
};