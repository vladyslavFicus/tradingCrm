const path = require('path');
const { override, useEslintRc, addBabelPlugin } = require('customize-cra');

module.exports = override(
  useEslintRc(path.resolve('.eslintrc.json')),
  addBabelPlugin('module:jsx-control-statements'),
);
