/* eslint-disable */
const ymlReader = require('yamljs');
const zookeeper = require('node-zookeeper-client');
const _ = require('lodash');

module.exports = function (params) {
  return new Promise(function (resolve, reject) {
    const environmentConfig = ymlReader.load(params.path);

    if (environmentConfig.zookeeper.url && environmentConfig.brand.name) {
      const configPath = `/system/${environmentConfig.brand.name}/nas/brand`;
      const client = zookeeper.createClient(environmentConfig.zookeeper.url);

      client.once('connected', function () {
        const config = {};
        Promise.all(
          params.allowedKeys
            .map(function (key) {
              return new Promise(function (res) {
                client.getData(`${configPath}/${key}`, function (err, data) {
                  const value = data.toString('UTF-8');

                  if (err) {
                    reject(err.stack);

                    return;
                  }

                  _.set(config, key, value);
                  res();

                  return value;
                });
              });
            })
        ).then(function () {
          client.close();

          resolve(config);
        });
      });

      client.connect();
    }
  });
};
