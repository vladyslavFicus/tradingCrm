import keyMirror from 'keymirror';

const entities = keyMirror({
  OPERATOR: null,
  PROFILE: null,
  PAYMENT: null,
});

const entitiesPrefixes = {
  [entities.OPERATOR]: 'OP',
  [entities.PROFILE]: 'PL',
  [entities.PAYMENT]: 'TA',
};

export {
  entities,
  entitiesPrefixes,
};
