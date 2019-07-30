const fs = require('fs');
const path = require('path');
const SentryRelease = require('sentry-release');

const { APP_VERSION } = process.env;

const distPath = path.resolve(`${__dirname}/../../build`);

(new SentryRelease({
  token: 'f43155a2ee94459ea3672bb858babdc72121b45fa97544749758a2c0d72903f4',
  organization: 'falcon-fe',
  project: 'backoffice',
  releaseVersion: APP_VERSION,
  distPath: `${distPath}/static/js`,
})).release();
