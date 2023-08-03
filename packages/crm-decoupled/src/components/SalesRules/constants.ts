export default {
  countries: {
    fieldName: 'countries',
    translateMultiple: 'HIERARCHY.PROFILE_RULE_TAB.GRID.COUNTRIES',
    translateSingle: 'HIERARCHY.PROFILE_RULE_TAB.GRID.COUNTRY',
  },
  languages: {
    fieldName: 'languages',
    translateMultiple: 'HIERARCHY.PROFILE_RULE_TAB.GRID.LANGUAGES',
    translateSingle: 'HIERARCHY.PROFILE_RULE_TAB.GRID.LANGUAGE',
    withUpperCase: true,
  },
  sources: {
    fieldName: 'sources',
    translateMultiple: 'HIERARCHY.PROFILE_RULE_TAB.GRID.SOURCES',
    translateSingle: 'HIERARCHY.PROFILE_RULE_TAB.GRID.SOURCE',
  },
};

export const OPERATORS_SORT = [
  { column: 'operatorStatus', direction: 'ASC' },
  { column: 'firstName', direction: 'ASC' },
  { column: 'lastName', direction: 'ASC' },
];
