enum statuses {
  NEW = 'NEW',
  CONVERTED = 'CONVERTED',
}

const leadStatuses = {
  [statuses.NEW]: 'LEADS.STATUSES.NEW',
  [statuses.CONVERTED]: 'LEADS.STATUSES.CONVERTED',
};

export {
  statuses,
  leadStatuses,
};
