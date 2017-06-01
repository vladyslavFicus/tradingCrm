import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { filterLabels } from '../../constants/user';

const formatters = {};
const formatValue = (attribute, value) => formatters[attribute]
  ? formatters[attribute].reduce((res, formatter) => formatter(res), value)
  : value;

const FeedInfoPlayerProfileSearch = ({ data }) => (
  <div className="feed-item_info-details">
    <div className="text-uppercase margin-bottom-10">
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_SEARCH.SEARCH_PARAMETERS')}
    </div>

    {Object.keys(data.details).map(attribute => (
      <div key={attribute}>
        {filterLabels[attribute] || attribute}:
        <span className="feed-item_info-details_value">
          {formatValue(attribute, data.details[attribute].toString())}
        </span>
      </div>
    ))}
  </div>
);
FeedInfoPlayerProfileSearch.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoPlayerProfileSearch;
