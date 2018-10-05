import I18n from '../../../../../utils/fake-i18n';

const deskTypes = [{
  label: I18n.t('DESKS.MODAL.LABELS.DESK_TYPE_OPTIONS.RETENTION'),
  value: 'RETENTION',
}, {
  label: I18n.t('DESKS.MODAL.LABELS.DESK_TYPE_OPTIONS.SALES'),
  value: 'SALES',
}, {
  label: I18n.t('DESKS.MODAL.LABELS.DESK_TYPE_OPTIONS.NINJA'),
  value: 'NINJA',
}];

const defaultDeskFlag = [{
  label: I18n.t('DESKS.GRID_FILTERS.DESK_TYPE.ANY'),
  value: 'ANY',
}, {
  label: I18n.t('DESKS.GRID_FILTERS.DESK_TYPE.NO'),
  value: 'NO',
}, {
  label: I18n.t('DESKS.GRID_FILTERS.DESK_TYPE.YES'),
  value: 'YES',
}];

const deskModalAttributeLabels = {
  name: I18n.t('DESKS.MODAL.LABELS.DESK_NAME'),
  office: I18n.t('DESKS.MODAL.LABELS.OFFICE_NAME'),
  language: I18n.t('DESKS.MODAL.LABELS.LANGUAGE'),
  deskType: I18n.t('DESKS.MODAL.LABELS.DESK_TYPE'),
};

export {
  deskTypes,
  defaultDeskFlag,
  deskModalAttributeLabels,
};
