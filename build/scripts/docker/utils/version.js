const fs = require('fs');
const { v4 } = require('uuid');

const VERSION_PATH = `${__dirname}/../../build/VERSION`;

let version = v4();

if (process.env.NODE_ENV === 'development') {
  version = 'dev';
}

if (fs.existsSync(VERSION_PATH)) {
  version = fs.readFileSync(VERSION_PATH, { encoding: 'UTF-8' });
}

module.exports = {
  version,
};
