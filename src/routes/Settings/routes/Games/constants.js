import I18n from '../../../../utils/fake-i18n';

const attributeLabels = {
  keyword: I18n.t('GAMES.GRID.KEYWORD'),
  gameProvider: I18n.t('GAMES.GRID.PROVIDER'),
  gameAggregator: I18n.t('GAMES.AGGREGATOR'),
  file: I18n.t('GAMES.IMPORT_MODAL.FILE'),
  category: I18n.t('GAMES.GAME_TYPE'),
  type: I18n.t('GAMES.GRID.PLATFORM'),
  withLines: I18n.t('GAMES.FREE_SPINS_AVAILABILITY'),
};

const attributePlaceholders = {
  keyword: I18n.t('GAMES.GRID.KEYWORD_PLACEHOLDER'),
};

export { attributeLabels, attributePlaceholders };
