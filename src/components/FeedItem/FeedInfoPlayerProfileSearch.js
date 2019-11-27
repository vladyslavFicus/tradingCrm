import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import { filterLabels } from '../../constants/user';
import FeedDetails from './FeedDetails';

const FeedInfoPlayerProfileSearch = ({ data: { details } }) => (
  <Fragment>
    <div className="text-uppercase margin-bottom-10">
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_SEARCH.SEARCH_PARAMETERS')}
    </div>
    <FeedDetails
      items={details}
      attributeLabels={filterLabels}
    />
  </Fragment>
);

FeedInfoPlayerProfileSearch.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoPlayerProfileSearch;
