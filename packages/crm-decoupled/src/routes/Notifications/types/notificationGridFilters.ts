export type FormValues = {
  searchKeyword?: string,
  operatorDesks?: Array<string>,
  operatorTeams?: Array<string>,
  operators?: Array<string>,
  notificationTypes?: Array<string>,
  notificationSubtypes?: Array<string>,
  creationDateRange?: {
    from?: string,
    to?: string,
  },
};
