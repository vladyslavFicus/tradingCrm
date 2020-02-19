import keyMirror from 'keymirror';
import { getActiveBrandConfig } from 'config';

const isActiveRegulation = getActiveBrandConfig().regulation.isActive;

const affiliateTypes = keyMirror({
  ...(isActiveRegulation && { NULLPOINT: null }),
  AFFILIATE: null,
  NONE: null,
});

const affiliateTypeLabels = {
  ...(isActiveRegulation && { [affiliateTypes.NULLPOINT]: 'PARTNERS.TYPES.NULLPOINT' }),
  [affiliateTypes.AFFILIATE]: 'PARTNERS.TYPES.AFFILIATE',
  [affiliateTypes.NONE]: 'PARTNERS.TYPES.DIRECT',
};

export {
  affiliateTypes,
  affiliateTypeLabels,
};
