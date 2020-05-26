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

const satelliteOptions = getSatelliteOptions();

export {
  statuses,
  statusLabels,
  satelliteOptions,
};
