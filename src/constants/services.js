import keyMirror from 'keymirror';

const services = keyMirror({
  profile: null,
  operator: null,
  payment: null,
  payment_view: null,
  trading_activity: null,
  trading_payment: null,
  trading_lead: null,
});

export {
  services,
};
