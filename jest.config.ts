import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'jest-css-modules-transform'
  },
  collectCoverageFrom: [
    'src/services/slices/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
};

export default config;