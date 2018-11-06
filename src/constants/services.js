import keyMirror from 'keymirror';

const services = keyMirror({
  dwh: null,
  profile: null,
  operator: null,
  payment: null,
  campaign: null,
  cms: null,
  game_info: null,
  payment_view: null,
  promotion: null,
  gaming_activity: null,
  trading_activity: null,
  trading_lead_updater: null,
  reconciliation: null,
  conditional_tag: null,
  player_report: null,
});

export {
  services,
};
