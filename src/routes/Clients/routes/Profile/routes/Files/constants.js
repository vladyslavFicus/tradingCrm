import keyMirror from 'keymirror';

const attributeLabels = {
  keyword: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.SEARCH_BY',
  fileCategory: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.FILE_CATEGORY',
  uploadDateFrom: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.DATE_FROM',
  uploadDateTo: 'PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.DATE_TO',
};

export const statuses = keyMirror({
  APPROVED: null,
  REJECTED: null,
  PENDING: null,
});

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

const categoryStatusesColor = {
  PENDING: 'color-info',
  REJECTED: 'color-danger',
  APPROVED: 'color-success',
};

export { attributeLabels, statusesCategory, categoryStatusesColor };

export default attributeLabels;
