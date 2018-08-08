import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { filterLabels } from '../../constants/user';
import renderLabel from '../../utils/renderLabel';

const formatters = {};
const formatValue = (attribute, value) => (
  formatters[attribute]
    ? formatters[attribute].reduce((res, formatter) => formatter(res), value)
    : value
);

const FeedInfoPlayerProfileSearch = ({ data }) => (
  <Fragment>
    <div className="text-uppercase margin-bottom-10">
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_SEARCH.SEARCH_PARAMETERS')}
    </div>

    {Object.keys(data.details).map(attribute => (
      <Fragment key={attribute}>
        {renderLabel(attribute, filterLabels)}:
        <span className="feed-item__content-value">
          {formatValue(attribute, data.details[attribute].toString())}
        </span>
        <br />
      </Fragment>
    ))}
  </Fragment>
);

FeedInfoPlayerProfileSearch.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoPlayerProfileSearch;
