import {
   JestConfigWithTsJest as Config,
   pathsToModuleNameMapper,
} from 'ts-jest';
import { jsWithTsESM } from 'ts-jest/presets';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
   ...jsWithTsESM,
   roots: ['<rootDir>/src/lib'],
   modulePaths: [compilerOptions.baseUrl],
   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
   testMatch: ['**/?(*.)+(spec|test).ts'],
   transform: {
      '^.+\\.ts': [
         'ts-jest',
         {
            tsconfig: 'tsconfig.json',
            useESM: true,
         },
      ],
   },
};

export default config;
