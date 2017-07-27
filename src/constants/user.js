import keyMirror from 'keymirror';
import permissions from '../config/permissions';

const attributeLabels = {
  acceptedTermsId: 'Accepted terms ID',
  address: 'Address',
  addressKycMetaData: 'Address files',
  kycAddressStatus: 'Address status',
  affiliateId: 'Affiliate ID',
  birthDate: 'Birth date',
  btag: 'B-Tag',
  city: 'City',
  completed: 'Profile completion',
  confirmedEmail: 'Confirmed email',
  country: 'Country',
  email: 'E-mail',
  firstName: 'First name',
  gender: 'Gender',
  id: 'Profile ID',
  identifier: 'Passport ID',
  kycCompleted: 'KYC Completion',
  languageCode: 'Language',
  lastName: 'Last name',
  marketingMail: 'Marketing Mails',
  marketingNews: 'Marketing News',
  marketingSMS: 'Marketing SMS',
  personalKycMetaData: 'Personal files',
  kycPersonalStatus: 'Personal status',
  phoneNumber: 'Phone number',
  phoneNumberVerified: 'Phone number verification',
  postCode: 'Post code',
  profileStatus: 'Status',
  profileStatusComment: 'Status comment',
  profileStatusReason: 'Status reason',
  tags: 'Profile tags',
  registrationDate: 'Registration date',
  registrationIP: 'Registration IP',
  suspendEndDate: 'Suspend end date',
  title: 'Title',
  token: 'Token',
  tokenExpirationDate: 'Token expiration date',
  username: 'Username',
  playerUUID: 'ID',
};
const filterLabels = {
  searchValue: 'Search by',
  country: 'Country',
  city: 'City',
  age: 'Age',
  ageFrom: 'Age from',
  ageTo: 'Age to',
  currencies: 'Currency',
  affiliateId: 'Affiliate ID',
  status: 'Status',
  tags: 'Tags',
  segments: 'Segments',
  registrationDate: 'Registered',
  registrationDateFrom: 'Registered from',
  registrationDateTo: 'Registered to',
  balance: 'Balance',
  balanceFrom: 'Balance from',
  balanceTo: 'Balance to',
};
const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
  BLOCKED: null,
  SUSPENDED: null,
  COOLOFF: null,
});
const actions = keyMirror({
  BLOCK: null,
  UNBLOCK: null,
  SUSPEND: null,
  RESUME: null,
  PROLONG: null,
});
const reasons = [
  'REASON_ONE',
  'REASON_TWO',
  'REASON_THREE',
  'REASON_FOUR',
];
const statusesLabels = {
  [statuses.INACTIVE]: 'Inactive',
  [statuses.ACTIVE]: 'Active',
  [statuses.BLOCKED]: 'Blocked',
  [statuses.SUSPENDED]: 'Self Excluded',
  [statuses.COOLOFF]: 'Cool off',
};
const durationUnits = keyMirror({
  DAYS: null,
  WEEKS: null,
  MONTHS: null,
  YEARS: null,
  PERMANENT: null,
});
const statusActions = {
  [statuses.ACTIVE]: [
    {
      action: actions.BLOCK,
      label: 'Block',
      reasons,
      permission: permissions.USER_PROFILE.BLOCK,
    },
    {
      action: actions.SUSPEND,
      label: 'Self Exclusion',
      reasons,
      permission: permissions.USER_PROFILE.SUSPEND,
    },
  ],
  [statuses.BLOCKED]: [
    {
      action: actions.UNBLOCK,
      label: 'Unblock',
      reasons: [
        'UNBLOCK_REASON_ONE',
        'UNBLOCK_REASON_TWO',
        'UNBLOCK_REASON_THREE',
        'UNBLOCK_REASON_FOUR',
      ],
      permission: permissions.USER_PROFILE.UNBLOCK,
    },
  ],
  [statuses.SUSPENDED]: [
    {
      action: actions.PROLONG,
      label: 'Prolong',
      reasons,
      permission: permissions.USER_PROFILE.PROLONG,
    },
    {
      action: actions.RESUME,
      label: 'Resume',
      reasons,
      permission: permissions.USER_PROFILE.RESUME,
    },
  ],
  [statuses.COOLOFF]: [
    {
      action: actions.RESUME,
      label: 'Resume',
      reasons,
      permission: permissions.USER_PROFILE.RESUME,
    },
  ],
};
const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-warning',
  [statuses.BLOCKED]: 'color-danger',
  [statuses.SUSPENDED]: 'color-secondary',
  [statuses.COOLOFF]: 'color-info',
};

export {
  attributeLabels,
  statuses,
  statusesLabels,
  durationUnits,
  actions,
  statusActions,
  statusColorNames,
  filterLabels,
};
