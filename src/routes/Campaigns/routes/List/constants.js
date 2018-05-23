import I18n from '../../../../utils/fake-i18n';

const filterLabels = {
  searchBy: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.SEARCH_BY.LABEL'),
  status: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.STATUS.LABEL'),
  fulfillmentType: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.FULFILLMENT_TYPE.LABEL'),
  targetType: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.TARGET_TYPE.LABEL'),
  creationDate: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.CREATION_DATE.LABEL'),
  activityDate: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.ACTIVITY_DATE.LABEL'),
};

const filterPlaceholders = {
  searchBy: I18n.t('CAMPAIGNS.LIST.GRID_VIEW_FILTER.SEARCH_BY.PLACEHOLDER'),
};

export {
  filterLabels,
  filterPlaceholders,
};
