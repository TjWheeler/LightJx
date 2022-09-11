/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    'clearMocks': true,
    'collectCoverage': true,
    'coverageProvider': 'v8',
    'rootDir': '__tests__',
    //'testRegex': '../__tests__/**/*.(jt)s',
    'transform': {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    'collectCoverageFrom': [
      '**/*.(t|j)s',
    ],
    'coverageDirectory': '../coverage',
    'testEnvironment': 'node',
    'moduleFileExtensions': [
      'js',
      'json',
      'ts',
    ],
    'testTimeout': 2000,
    "coveragePathIgnorePatterns": [
      "src/index.ts",
    ],
  };