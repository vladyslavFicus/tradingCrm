import Fingerprint2 from 'fingerprintjs2';

export default () => new Promise((resolve) => {
  new Fingerprint2().get((hash, components) => resolve({
    hash,
    params: components
      .filter(({ key }) => ([
        'user_agent', 'language', 'color_depth',
        'pixel_ratio', 'hardware_concurrency', 'resolution', 'available_resolution',
        'timezone_offset', 'cpu_class', 'navigator_platform', 'do_not_track', 'regular_plugins',
      ].indexOf(key) > -1))
      .reduce((result, item) => ({ ...result, [item.key]: [item.value] }), {}),
  }));
});
