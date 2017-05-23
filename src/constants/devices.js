import keyMirror from 'keymirror';

const types = keyMirror({
  MOBILE: null,
  DESKTOP: null,
  NOT_DETECTED: null,
});

const operatingSystems = keyMirror({
  IOS: null,
  ANDROID: null,
  WINDOWS: null,
  MACOS: null,
  LINUX: null,
  OTHER: null,
});

const typesLabels = {
  [types.MOBILE]: 'Mobile',
  [types.DESKTOP]: 'Desktop',
  [types.NOT_DETECTED]: 'Not detected',
};

const operatingSystemsLabels = {
  [operatingSystems.IOS]: 'iOS',
  [operatingSystems.ANDROID]: 'Android',
  [operatingSystems.WINDOWS]: 'Windows',
  [operatingSystems.MACOS]: 'MacOS',
  [operatingSystems.LINUX]: 'LINUX',
  [operatingSystems.OTHER]: 'OTHER',
};

const typesColor = {
  [types.MOBILE]: 'color-info',
  [types.DESKTOP]: 'color-success',
  [types.NOT_DETECTED]: 'color-warning',
};

export {
  types,
  typesColor,
  typesLabels,
  operatingSystems,
  operatingSystemsLabels,
};
