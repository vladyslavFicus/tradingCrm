const path = require('path');
const ymlReader = require('yamljs');

const {
  NAS_PROJECT,
  SECRET_PATH = '/backoffice/lib/etc/',
} = process.env;

if (!NAS_PROJECT) {
  throw new Error('Missing required environment variable "NAS_PROJECT"');
}

let config;

try {
  config = ymlReader.load(path.resolve(SECRET_PATH, 'application-config.yml'));
} catch (e) {
  config = ymlReader.load(path.resolve(SECRET_PATH, `application-${NAS_PROJECT}.yml`));
}

module.exports = config;
