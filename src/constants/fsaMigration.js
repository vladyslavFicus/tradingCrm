import keyMirror from 'keymirror';

const fsaStatuses = keyMirror({
  MIGRATION_ACCEPTED: null,
  MIGRATION_DECLINED: null,
  MIGRATION_STARTED: null,
  MIGRATION_FINISHED: null,
  MIGRATION_FAILED: null,
});

const fsaStatusColorNames = {
  [fsaStatuses.MIGRATION_ACCEPTED]: 'color-success',
  [fsaStatuses.MIGRATION_DECLINED]: 'color-danger',
  [fsaStatuses.MIGRATION_STARTED]: 'color-warning',
  [fsaStatuses.MIGRATION_FINISHED]: 'color-success',
  [fsaStatuses.MIGRATION_FAILED]: 'color-danger',
};

const fsaStatusesLabels = {
  [fsaStatuses.MIGRATION_ACCEPTED]: 'MIGRATE.STATUSES.MIGRATION_ACCEPTED',
  [fsaStatuses.MIGRATION_DECLINED]: 'MIGRATE.STATUSES.MIGRATION_NOT_ACCEPTED',
  [fsaStatuses.MIGRATION_STARTED]: 'MIGRATE.STATUSES.MIGRATION_STARTED',
  [fsaStatuses.MIGRATION_FINISHED]: 'MIGRATE.STATUSES.MIGRATION_FINISHED',
  [fsaStatuses.MIGRATION_FAILED]: 'MIGRATE.STATUSES.MIGRATION_FAILED',
};

export {
  fsaStatuses,
  fsaStatusesLabels,
  fsaStatusColorNames,
};
