const SentryCli = require('@sentry/cli');

// For create sentry release run:
// APP_VERSION=YOUR_APP_VERSION SENTRY_AUTH_TOKEN=YOUR_SENTRY_TOKEN yarn sentry-release

async function createReleaseAndUpload() {
  const release = process.env.APP_VERSION;

  if (!release) {
    console.warn('APP_VERSION is not set!');

    return;
  }

  // SentryCli use options from .sentryclirc
  const cli = new SentryCli();

  try {
    console.log(`Creating sentry release ${release}`);
    await cli.releases.new(release);

    console.log('Uploading source maps');
    await cli.releases.uploadSourceMaps(release, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false,
    });

    console.log('Finalizing release');
    await cli.releases.finalize(release);
  } catch (e) {
    console.error('Source maps uploading failed:', e);
  }
}

createReleaseAndUpload();
