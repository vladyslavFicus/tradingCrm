const buildConfig = require('./buildConfig');
const { saveConfig, writeRandomConfigSrcPath, createHealth, buildNginxConfig } = require('./utils/config-file');

const INDEX_HTML_PATH = '/opt/build/index.html';

(async () => {
  const config = await buildConfig();

  await buildNginxConfig();
  await saveConfig(config);
  await writeRandomConfigSrcPath(INDEX_HTML_PATH);
  await createHealth();
})();
