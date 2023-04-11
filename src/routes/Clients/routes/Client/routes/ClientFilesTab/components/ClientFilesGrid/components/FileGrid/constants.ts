const attributeLabels = {
  keyword: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.SEARCH_BY',
  fileCategory: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.FILE_CATEGORY',
  uploadDateFrom: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.DATE_FROM',
  uploadDateTo: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.DATE_TO',
};

export enum statuses {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  NEW = 'NEW',
  NOT_VERIFIED = 'NOT_VERIFIED',
  NOT_VERIFIED_APPROVED = 'NOT_VERIFIED_APPROVED',
  DELETED = 'DELETED',
  OTHER = 'OTHER',
}

const statusesCategory = [
  {
    value: statuses.APPROVED,
    label: 'FILES.STATUSES.APPROVED',
  },
  {
    value: statuses.REJECTED,
    label: 'FILES.STATUSES.REJECTED',
  },
  {
    value: statuses.PENDING,
    label: 'FILES.STATUSES.PENDING',
  },
];

const statusesFile = [
  {
    value: statuses.APPROVED,
    label: 'FILES.STATUSES_FILE.APPROVED',
  },
  {
    value: statuses.REJECTED,
    label: 'FILES.STATUSES_FILE.REJECTED',
  },
  {
    value: statuses.NEW,
    label: 'FILES.STATUSES_FILE.NEW',
  },
  {
    value: statuses.NOT_VERIFIED,
    label: 'FILES.STATUSES_FILE.NOT_VERIFIED',
  },
  {
    value: statuses.NOT_VERIFIED_APPROVED,
    label: 'FILES.STATUSES_FILE.NOT_VERIFIED_APPROVED',
  },
  {
    value: statuses.DELETED,
    label: 'FILES.STATUSES_FILE.DELETED',
  },
  {
    value: statuses.OTHER,
    label: 'FILES.STATUSES_FILE.OTHER',
  },
];

export { attributeLabels, statusesCategory, statusesFile };

export default attributeLabels;
