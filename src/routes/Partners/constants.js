import keyMirror from 'keymirror';
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

const affiliateTypes = keyMirror({
  AFFILIATE: null,
});

const affiliateTypeLabels = {
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
