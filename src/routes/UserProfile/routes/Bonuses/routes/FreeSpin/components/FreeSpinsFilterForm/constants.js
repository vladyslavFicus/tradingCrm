import keyMirror from 'keymirror';
import I18n from '../../../../../../../../utils/fake-i18n';

const attributeLabels = {
  searchBy: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.SEARCH_BY'),
  assigned: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.ASSIGNED'),
  providerId: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.PROVIDER'),
  gameId: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.GAME'),
  availabilityDateRange: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.AVAILABILITY_DATE_RANGE'),
  startDate: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.START_DATE'),
  endDate: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_LABELS.END_DATE'),
};
const attributePlaceholders = {
  searchBy: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.ATTRIBUTES_PLACEHOLDERS.SEARCH_BY'),
};
const authorTypes = keyMirror({
  CAMPAIGN: null,
  OPERATOR: null,
});
const authorTypesLabels = {
  [authorTypes.CAMPAIGN]: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.AUTHOR_TYPES.CAMPAIGN'),
  [authorTypes.OPERATOR]: I18n.t('CONSTANTS.FREE_SPINS.FILTER_FORM.AUTHOR_TYPES.OPERATOR'),
};

export {
  attributeLabels,
  attributePlaceholders,
  authorTypes,
  authorTypesLabels,
};
