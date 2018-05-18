import keyMirror from 'keymirror';
import I18n from '../../../../utils/fake-i18n';

const statuses = keyMirror({
  inactive: null,
  active: null,
});
const statusLabels = {
  [statuses.inactive]: I18n.t('CMS_GAMES.GRID_VIEW.STATUS.INACTIVE'),
  [statuses.active]: I18n.t('CMS_GAMES.GRID_VIEW.STATUS.ACTIVE'),
};
const statusClassNames = {
  [statuses.inactive]: 'text-danger',
  [statuses.active]: 'text-success',
};

const freeSpinsStatuses = keyMirror({
  not_available: null,
  available: null,
  active: null,
});
const freeSpinsStatusLabels = {
  [freeSpinsStatuses.not_available]: I18n.t('CMS_GAMES.GRID_VIEW.FREE_SPINS_STATUS.NOT_AVAILABLE'),
  [freeSpinsStatuses.available]: I18n.t('CMS_GAMES.GRID_VIEW.FREE_SPINS_STATUS.AVAILABLE'),
  [freeSpinsStatuses.active]: I18n.t('CMS_GAMES.GRID_VIEW.FREE_SPINS_STATUS.ACTIVE'),
};

const technologies = keyMirror({
  html5: null,
  flash: null,
});

const platforms = keyMirror({
  DESKTOP: null,
  MOBILE: null,
  DESKTOP_AND_MOBILE: null,
});
const platformLabels = {
  [platforms.DESKTOP]: I18n.t('CMS_GAMES.GRID_VIEW.PLATFORM.DESKTOP'),
  [platforms.MOBILE]: I18n.t('CMS_GAMES.GRID_VIEW.PLATFORM.MOBILE'),
  [platforms.DESKTOP_AND_MOBILE]: I18n.t('CMS_GAMES.GRID_VIEW.PLATFORM.DESKTOP_AND_MOBILE'),
};

const filterLabels = {
  provider: I18n.t('CMS_GAMES.GRID_VIEW_FILTER.PROVIDER'),
  platform: I18n.t('CMS_GAMES.GRID_VIEW_FILTER.PLATFORM'),
  technology: I18n.t('CMS_GAMES.GRID_VIEW_FILTER.TECHNOLOGY'),
  freeSpinsStatus: I18n.t('CMS_GAMES.GRID_VIEW_FILTER.FREE_SPINS_STATUS'),
  status: I18n.t('CMS_GAMES.GRID_VIEW_FILTER.STATUS'),
};

export {
  statuses,
  statusLabels,
  statusClassNames,
  freeSpinsStatuses,
  freeSpinsStatusLabels,
  technologies,
  platforms,
  platformLabels,
  filterLabels,
};
