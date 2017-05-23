import Fingerprint2 from 'fingerprintjs2';

export default () => new Promise((resolve) => {
  new Fingerprint2().get((hash, components) => resolve({
    hash,
    params: components.reduce((result, item) => ({ ...result, [item.key]: [item.value] }), {}),
  }));
});
