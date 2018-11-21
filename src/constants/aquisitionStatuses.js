import keyMirror from 'keymirror';

export const aquisitionStatusesNames = keyMirror({
  SALES: null,
  RETENTION: null,
});

export const aquisitionStatuses = [{
  value: 'SALES',
  label: 'COMMON.AQUISITION_STATUSES.SALES',
}, {
  value: 'RETENTION',
  label: 'COMMON.AQUISITION_STATUSES.RETENTION',
}];
