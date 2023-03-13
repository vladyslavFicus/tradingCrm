import { statuses } from '../../constants';

const MAX_SELECTED_LEADS = 5000;

const leadAccountStatuses = {
  [statuses.CONVERTED]: {
    label: 'LEADS.STATUSES.CONVERTED',
    value: statuses.CONVERTED,
  },
  [statuses.NEW]: {
    label: 'LEADS.STATUSES.NEW',
    value: statuses.NEW,
  },
};

const neverCalledTypes = [
  {
    value: false,
    label: 'COMMON.NO',
  },
  {
    value: true,
    label: 'COMMON.YES',
  },
];

export {
  MAX_SELECTED_LEADS,
  leadAccountStatuses,
  neverCalledTypes,
};
