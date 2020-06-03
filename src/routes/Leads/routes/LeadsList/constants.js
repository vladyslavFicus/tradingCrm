import { statuses } from '../../constants';

const MAX_SELECTED_LEADS = 10000;

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

export {
  MAX_SELECTED_LEADS,
  leadAccountStatuses,
};
