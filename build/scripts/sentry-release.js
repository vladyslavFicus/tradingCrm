const fs = require('fs');
const path = require('path');
const SentryRelease = require('sentry-release');

const distPath = path.resolve(`${__dirname}/../../dist`);

(new SentryRelease({
  token: 'c0009abe4b184119829bcc430bd82238d973ee263bba45e9802d161de85072e2',
  organization: 'newagesol',
  project: 'forex_backoffice',
  releaseVersion: fs.readFileSync(`${distPath}/VERSION`, { encoding: 'UTF-8' }),
  distPath,
})).release();
