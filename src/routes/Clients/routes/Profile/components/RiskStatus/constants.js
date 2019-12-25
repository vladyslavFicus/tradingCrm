import keyMirror from 'keymirror';

const riskStatuses = keyMirror({
  HIGH_RISK: null,
  MEDIUM_RISK: null,
  LOW_RISK: null,
});

const riskStatusTranslations = {
  [riskStatuses.HIGH_RISK]: 'CLIENT_PROFILE.RISKS.STATUS.STATUSES.HIGH_RISK',
  [riskStatuses.MEDIUM_RISK]: 'CLIENT_PROFILE.RISKS.STATUS.STATUSES.MEDIUM_RISK',
  [riskStatuses.LOW_RISK]: 'CLIENT_PROFILE.RISKS.STATUS.STATUSES.LOW_RISK',
};

export {
  riskStatuses,
  riskStatusTranslations,
};
