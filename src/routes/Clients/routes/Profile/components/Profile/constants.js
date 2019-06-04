import I18n from 'utils/fake-i18n';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { services } from 'constants/services';

export const userProfileTabs = [{
  label: I18n.t('CLIENT_PROFILE.TABS.PROFILE'),
  url: '/clients/:id/profile',
}, {
  url: '/clients/:id/payments',
  label: I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS'),
  permissions: new Permissions(permissions.PAYMENTS.PLAYER_PAYMENTS_LIST),
}, {
  url: '/clients/:id/trading-activity',
  label: I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY'),
  permissions: new Permissions(permissions.TRADING_ACTIVITY.CLIENT_TRADING_ACTIVITY),
  service: services.trading_activity,
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.ACCOUNTS'),
  url: '/clients/:id/accounts',
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.CALLBACKS'),
  url: '/clients/:id/callbacks',
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.FILES'),
  url: '/clients/:id/files',
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.NOTES'),
  url: '/clients/:id/notes',
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.FEED'),
  url: '/clients/:id/feed',
}];

export const moveField = type => ({
  name: 'aquisitionStatus',
  labelName: 'move',
  component: 'select',
  data: [aquisitionStatuses.find(({ value }) => type === value)],
});
