import keyMirror from 'keymirror';

const attributeLabels = {
  acceptedTermsId: 'Accepted terms ID',
  address: 'Address',
  addressKycMetaData: 'Address files',
  addressStatus: 'Address status',
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
  kycStatus: 'KYC Status',
  kycStatusReason: 'KYC Status reason',
  languageCode: 'Language',
  lastName: 'Last name',
  marketingMail: 'Marketing Mails',
  marketingNews: 'Marketing News',
  marketingSMS: 'Marketing SMS',
  personalKycMetaData: 'Personal files',
  personalStatus: 'Personal status',
  phoneNumber: 'Phone number',
  phoneNumberVerified: 'Phone number verification',
  postCode: 'Post code',
  profileStatus: 'Status',
  profileStatusComment: 'Status comment',
  profileStatusReason: 'Status reason',
  profileTags: 'Profile tags',
  registrationDate: 'Registration date',
  registrationIP: 'Registration IP',
  suspendEndDate: 'Suspend end date',
  title: 'Title',
  token: 'Token',
  tokenExpirationDate: 'Token expiration date',
  username: 'Username',
  uuid: 'ID',
};
const statuses = keyMirror({
  INACTIVE: null,
  ACTIVE: null,
  BLOCKED: null,
  SUSPENDED: null,
});
const actions = keyMirror({
  BLOCK: null,
  UNBLOCK: null,
  SUSPEND: null,
  RESUME: null,
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
  [statuses.SUSPENDED]: 'Suspended',
};
const suspendPeriods = keyMirror({
  DAY: null,
  WEEK: null,
  MONTH: null,
  PERMANENT: null,
});
const statusActions = {
  [statuses.ACTIVE]: [
    {
      action: actions.BLOCK,
      label: 'Block',
      reasons,
    },
    {
      action: actions.SUSPEND,
      label: 'Suspend',
      reasons,
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
    },
  ],
};
const statusColorNames = {
  [statuses.ACTIVE]: 'color-success',
  [statuses.INACTIVE]: 'color-warning',
  [statuses.BLOCKED]: 'color-danger',
  [statuses.SUSPENDED]: 'color-secondary',
};

export {
  attributeLabels,
  statuses,
  statusesLabels,
  actions,
  statusActions,
  suspendPeriods,
  statusColorNames,
};
