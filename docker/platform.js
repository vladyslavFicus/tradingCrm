const ConfigMap = require('@hrzn/k8s-configmap');

const configMap = new ConfigMap({
  file: process.env.PLATFORM_CONFIG,
  namespace: 'platform',
  configmap: 'platform-config',
  selector: 'application-config.yml',
});

async function load() {
  console.log('\x1b[32m', '⏳ Kubernetes ConfigMap loading...', '\x1b[37m');

  const config = await configMap.load();

  console.log('\x1b[32m', '✅ Kubernetes ConfigMap loaded successfully', '\x1b[37m');

  return config;
}

module.exports = { load };
