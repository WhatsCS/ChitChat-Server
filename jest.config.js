// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  setupFilesAfterEnv: [
    './scripts/testSuiteSetup.js'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Timeout setting
  testTimeout: 30000
}
