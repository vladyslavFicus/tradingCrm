import keyMirror from 'keymirror';

const affiliateTypes = keyMirror({
  AFFILIATE: null,
  NONE: null,
});

const affiliateTypeLabels = {
  [affiliateTypes.AFFILIATE]: 'PARTNERS.TYPES.AFFILIATE',
  [affiliateTypes.NONE]: 'PARTNERS.TYPES.DIRECT',
};

export {
  affiliateTypes,
  affiliateTypeLabels,
};
