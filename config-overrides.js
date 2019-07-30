const path = require('path');
const { override, useEslintRc, addBabelPlugin, disableEsLint } = require('customize-cra');

module.exports = override(
  // useEslintRc(path.resolve('.eslintrc.json')),
  disableEsLint(),
  addBabelPlugin('module:jsx-control-statements'),
);
