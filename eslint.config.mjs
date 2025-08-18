import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const [tsConfig] = await tseslint.configs.recommendedTypeChecked;

export default [
  // JavaScript
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      globals: globals.browser,
    },
    ...js.configs.recommended,
    ignores: ["dist/**", "node_modules/**", "bundler/**"]
  },

  // TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    ...tsConfig,
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'explicit',
        overrides: {
          constructors: 'no-public',
        },
      }],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true
        }
      ]
    },
  },
];