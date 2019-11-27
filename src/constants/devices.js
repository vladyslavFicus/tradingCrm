import keyMirror from 'keymirror';

const types = keyMirror({
  MOBILE: null,
  DESKTOP: null,
  UNKNOWN: null,
  TABLET: null,
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
  [types.MOBILE]: 'CONSTANTS.DEVICES.TYPES.MOBILE',
  [types.DESKTOP]: 'CONSTANTS.DEVICES.TYPES.DESKTOP',
  [types.UNKNOWN]: 'CONSTANTS.DEVICES.TYPES.UNKNOWN',
  [types.TABLET]: 'CONSTANTS.DEVICES.TYPES.TABLET',
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
  [types.UNKNOWN]: 'color-warning',
  [types.TABLET]: 'color-primary',
};

export {
  types,
  typesColor,
  typesLabels,
  operatingSystems,
  operatingSystemsLabels,
};
