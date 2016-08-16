const environmentConfiguration = __CONFIG_ENV__;

const config = {
  name: 'NAS Casino',
  version: '0.0.1a',
};

export function getApiRoot() {
  return environmentConfiguration.apiRoot && environmentConfiguration.endpointEntry ?
  environmentConfiguration.apiRoot + environmentConfiguration.endpointEntry
    : '';
}

export default { ...environmentConfiguration, config };
