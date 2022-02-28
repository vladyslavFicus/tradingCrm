module.exports = {
  parser: 'babel-eslint',
  env: {
    jest: true,
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
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
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
        schema: './graphql.schema.json',
        operations: [
          './src/**/*.gql',
          './src/**/*.js',
          './src/**/*.jsx',
          './src/**/*.ts',
          './src/**/*.tsx',
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
      },
    },
  ],
  rules: {
    // START: Workaround for babel-eslint https://github.com/babel/babel-eslint/issues/799
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: ['TemplateLiteral', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
        ignoreComments: false,
      },
    ],
    'template-curly-spacing': 'off',
    // END: Workaround

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
  },
  globals: {
    window: false,
    document: false,
    fetch: false,
    ExtractApolloTypeFromArray: false,
    ExtractApolloTypeFromPageable: false,
    HTMLInputElement: false,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: 'src',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'json/sort-package-json': 'standard',
    'json/json-with-comments-files': ['**/tsconfig.json', '.vscode/**'],
  },
};
