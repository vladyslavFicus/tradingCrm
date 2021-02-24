import keyMirror from 'keymirror';

const departments = keyMirror({
  ADMINISTRATION: null,
  CS: null,
  RFP: null,
  MARKETING: null,
  BI: null,
  SALES: null,
  RETENTION: null,
  DEALING: null,
  COMPLIANCE: null,
  FINANCE: null,
});

const roles = keyMirror({
  ROLE1: null,
  ROLE2: null,
  ROLE3: null,
  ROLE4: null,
});

export { departments, roles };
