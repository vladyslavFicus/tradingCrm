/* eslint-disable import/prefer-default-export */
import { I18n } from 'react-redux-i18n';

export const userProfileTabs = [{
  label: I18n.t('CLIENT_PROFILE.TABS.PROFILE'),
  url: '/clients/:id/profile',
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.TRANSACTIONS'),
  url: '/clients/:id/transactions',
}, {
  label: I18n.t('CLIENT_PROFILE.TABS.ACCOUNTS'),
  url: '/clients/:id/accounts',
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
