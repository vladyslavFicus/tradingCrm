import keyMirror from 'keymirror';
import { get } from 'lodash';
import I18n from '../../utils/fake-i18n';

export const attributeLabels = type => ({
  desk: I18n.t(`CLIENTS.MODALS.${type}_MODAL.DESK`),
  team: I18n.t('CLIENTS.MODALS.TEAM'),
  representative: I18n.t(`CLIENTS.MODALS.${type}_MODAL.REPRESENTATIVE`),
  status: I18n.t(`CLIENTS.MODALS.${type}_MODAL.STATUS`),
  move: I18n.t('CLIENTS.MODALS.MOVE_MODAL.MOVE_LABEL'),
});

export const components = keyMirror({
  select: null,
});

export const fieldNames = {
  DESK: 'deskId',
  TEAM: 'teamId',
  REPRESENTATIVE: 'repId',
  STATUS: 'status',
  ACQUISITION: 'aquisitionStatus',
};

export const getAgents = (apolloResponse, userType) => {
  const users = get(apolloResponse, 'hierarchy.hierarchyUsersByType.data');

  if (users) {
    return [
      ...users[`${userType}_AGENT`] || [],
      ...users[`${userType}_HOD`] || [],
      ...users[`${userType}_MANAGER`] || [],
      ...users[`${userType}_LEAD`] || [],
    ];
  }

  return null;
};

export const filterAgents = (agents, type) => agents
  .filter(({ userType }) => (
    userType === `${type}_AGENT` ||
    userType === `${type}_HOD` ||
    userType === `${type}_MANAGER` ||
    userType === `${type}_LEAD`
  ));
