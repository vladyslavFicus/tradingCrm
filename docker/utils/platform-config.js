const path = require('path');
const ymlReader = require('yamljs');

const {
  NAS_PROJECT,
  SECRET_PATH = '/forex_backoffice/lib/etc/',
} = process.env;

if (!NAS_PROJECT) {
  throw new Error('Missing required environment variable "NAS_PROJECT"');
}

module.exports = ymlReader.load(path.resolve(SECRET_PATH, `application-${NAS_PROJECT}.yml`));
