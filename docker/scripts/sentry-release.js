const SentryRelease = require('sentry-release');
const path = require('path');

const { APP_VERSION } = process.env;

const distPath = path.resolve(`${__dirname}/../../build`);

(new SentryRelease({
  apiRoot: 'https://sentry.cydev.io/api/',
  token: 'd8b8430dc203404a91bdd99ad85a24f666f917ba213742fe9656c733242429e1',
  organization: 'easytech',
  project: 'backoffice',
  releaseVersion: APP_VERSION,
  distPath: `${distPath}/static/js`,
})).release();
