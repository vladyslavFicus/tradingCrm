import Fingerprint2 from 'fingerprintjs2';

export default () => new Promise((resolve) => {
  new Fingerprint2().get((result, components) => resolve({
    hash: result,
    params: Object.assign(...components.map(item => ({ [item.key]: item.value }))),
  }));
});
