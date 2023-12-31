module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    jest: true,
    browser: true,
  },
  extends: [
    'airbnb',
    'plugin:jsx-control-statements/recommended',
  ],
  plugins: [
    'jsx-control-statements',
    'json-format',
  ],
  overrides: [
    // Typescript linting
    {
      parser: '@typescript-eslint/parser',
      files: ['*.ts', '*.tsx'],
      plugins: [
        'import',
        '@typescript-eslint',
      ],
      extends: [
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        'react/require-default-props': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/no-unresolved': [2, { commonjs: true, amd: true }],
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
      },
    },
    // GraphQL linting
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      processor: '@graphql-eslint/graphql',
    },
    {
      files: ['*.gql', '*.graphql'],
      extends: ['plugin:@graphql-eslint/operations-recommended'],
      parserOptions: {
        skipGraphQLConfig: true,
        schema: './packages/*/graphql.schema.json',
        operations: [
          './packages/*/src/**/*.gql',
          './packages/*/src/**/*.js',
          './packages/*/src/**/*.jsx',
          './packages/*/src/**/*.ts',
          './packages/*/src/**/*.tsx',
        ],
      },
      rules: {
        'no-trailing-spaces': 0,
        'no-multiple-empty-lines': 0,
        '@graphql-eslint/no-anonymous-operations': 'error',
        '@graphql-eslint/known-directives': 0,
        '@graphql-eslint/no-undefined-variables': 0,
        '@graphql-eslint/naming-convention': [
          'error',
          {
            OperationDefinition: {
              forbiddenPrefixes: [''],
              forbiddenSuffixes: [''],
            },
          },
        ],
        'spaced-comment': ['error', 'always', {
          line: {
            markers: ['#import', 'import'],
          },
        }],
      },
    },
  ],
  rules: {
    // Fix error on importing .ts|.tsx files
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        cjs: 'never',
      },
    ],
    'import/no-extraneous-dependencies': 0,
    'max-len': [2, 120],
    'react/prefer-stateless-function': 0,
    'react/forbid-foreign-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/destructuring-assignment': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'no-underscore-dangle': 0,
    'react/no-array-index-key': 0,
    'react/forbid-prop-types': 0,
    'object-curly-newline': 0,
    'class-methods-use-this': 0,
    'react/no-danger': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'import/prefer-default-export': 0,
    'react/jsx-no-undef': [2, { allowGlobals: true }],
    'react/jsx-one-expression-per-line': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'react/sort-comp': 0,
    'import/no-cycle': 0,
    'import/order': ['error', { groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'] }],
    'key-spacing': ['error', { singleLine: { beforeColon: false, afterColon: true } }],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma', // 'none' or 'semi' or 'comma'
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
      overrides: {
        interface: {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
        },
      },
    }],
  },
  globals: {
    ExtractApolloTypeFromArray: false,
    ExtractApolloTypeFromPageable: false,
    NodeJS: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json', 'packages/*/tsconfig.json'],
      },
      node: {
        paths: 'packages/*/src',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'json/sort-package-json': 'standard',
    'json/json-with-comments-files': ['**/tsconfig.json', '.vscode/**'],
  },
};
