import keyMirror from 'keymirror';

export const bonusTypes = keyMirror({
  FTD: null,
  REGISTRATION: null,
});

export const bonusTypesLabels = {
  [bonusTypes.FTD]: 'REFERRALS.BONUS_TYPE_STATUS.FTD',
  [bonusTypes.REGISTRATION]: 'REFERRALS.BONUS_TYPE_STATUS.REGISTRATION',
};
