import keyMirror from 'keymirror';
import { getActiveBrandConfig } from 'config';
import { getSatelliteOptions } from './utils';

const statuses = keyMirror({
  ACTIVE: null,
  CLOSED: null,
  INACTIVE: null,
});

const statusLabels = {
  [statuses.ACTIVE]: 'PARTNERS.STATUSES.ACTIVE',
  [statuses.CLOSED]: 'PARTNERS.STATUSES.CLOSED',
  [statuses.INACTIVE]: 'PARTNERS.STATUSES.INACTIVE',
};

const isActiveRegulation = getActiveBrandConfig().regulation.isActive;

const affiliateTypes = keyMirror({
  ...(isActiveRegulation && { NULLPOINT: null }),
  AFFILIATE: null,
});

const affiliateTypeLabels = {
  ...(isActiveRegulation && { [affiliateTypes.NULLPOINT]: 'PARTNERS.TYPES.NULLPOINT' }),
  [affiliateTypes.AFFILIATE]: 'PARTNERS.TYPES.AFFILIATE',
};

const satelliteOptions = getSatelliteOptions();

export {
  statuses,
  statusLabels,
  affiliateTypes,
  affiliateTypeLabels,
  satelliteOptions,
};
