const ConfigMap = require('@hrzn/k8s-configmap');

const configMap = new ConfigMap({
  file: process.env.INFRA_CONFIG,
  namespace: 'platform',
  configmap: 'infra-config',
  selector: 'infra-config.yml',
});

async function load() {
  console.log('\x1b[32m', '⏳ Kubernetes [infra] ConfigMap loading...', '\x1b[37m');

  const config = await configMap.load();

  console.log('\x1b[32m', '✅ Kubernetes [infra] ConfigMap loaded successfully', '\x1b[37m');

  return config;
}

module.exports = { load };
