import keyMirror from 'keymirror';

const entities = keyMirror({
  operator: null,
  profile: null,
  bonus: null,
  transaction: null,
});

const entitiesPrefixes = {
  [entities.operator]: 'OP',
  [entities.profile]: 'PL',
  [entities.bonus]: 'BM',
  [entities.transaction]: 'TR',
};

export {
  entities,
  entitiesPrefixes,
};
