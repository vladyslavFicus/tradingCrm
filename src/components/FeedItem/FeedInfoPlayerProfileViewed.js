import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import Uuid from '../Uuid';

const FeedInfoPlayerProfileViewed = ({ data }) => (
  <Fragment>
    {I18n.t('COMMON.PLAYER')}:
    <span className="feed-item__content-value">
      {data.details.firstName} {data.details.lastName}
    </span>
    {' - '}
    <Uuid
      uuid={data.details.playerUUID}
      uuidPrefix={data.details.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
    />
  </Fragment>
);

FeedInfoPlayerProfileViewed.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoPlayerProfileViewed;
