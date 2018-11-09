import I18n from '../../../../../../../utils/fake-i18n';

export default prefix => ({
  desk: I18n.t(`CLIENTS.MODALS.${prefix}.DESK`),
  team: I18n.t('CLIENTS.MODALS.TEAM'),
  representative: I18n.t(`CLIENTS.MODALS.${prefix}.REPRESENTATIVE`),
  status: I18n.t(`CLIENTS.MODALS.${prefix}.STATUS`),
});
