import keyMirror from 'keymirror';

const entities = keyMirror({
  operator: null,
  profile: null,
  bonus: null,
  payment: null,
});

const entitiesPrefixes = {
  [entities.operator]: 'OP',
  [entities.profile]: 'PL',
  [entities.bonus]: 'BM',
  [entities.payment]: 'TA',
};

export {
  entities,
  entitiesPrefixes,
};
