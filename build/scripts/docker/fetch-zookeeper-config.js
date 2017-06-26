/* eslint-disable */
const zookeeper = require('node-zookeeper-client');
const _ = require('lodash');

const getChildren = (client, configPath) => new Promise((resolve) => {
  client.getChildren(configPath, (error, children) => resolve(children));
});

module.exports = function (params) {
  return new Promise(function (resolve, reject) {
    const environmentConfig = params.environmentConfig;

    if (environmentConfig.zookeeper.url && environmentConfig.brand.name) {
      const configPath = `/system/${environmentConfig.brand.name}/nas/brand`;
      const client = zookeeper.createClient(environmentConfig.zookeeper.url);

      client.once('connected', async function () {
        const childKeys = await getChildren(client, configPath);

        const config = {};
        Promise.all(
          childKeys.map(function (key) {
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
