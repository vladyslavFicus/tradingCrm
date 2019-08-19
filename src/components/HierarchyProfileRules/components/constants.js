import I18n from '../../../utils/fake-i18n';

export default {
  countries: {
    fieldName: 'countries',
    translateMultiple: I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.COUNTRIES'),
    translateSingle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.COUNTRY'),
  },
  languages: {
    fieldName: 'languages',
    translateMultiple: I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.LANGUAGES'),
    translateSingle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.LANGUAGE'),
    withUpperCase: true,
  },
  sources: {
    fieldName: 'sources',
    translateMultiple: I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.SOURCES'),
    translateSingle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.SOURCE'),
  },
};
