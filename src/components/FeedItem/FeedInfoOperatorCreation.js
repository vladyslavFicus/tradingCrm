import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { rolesLabels } from '../../constants/operators';

const FeedInfoOperatorCreation = ({ data }) => (
  <div className="feed-item_info-details">
    {
      data.details.operatorsName &&
      <div>
        {I18n.t('FEED_ITEM.OPERATOR_CREATION.OPERATOR_NAME')}:
        <span className="feed-item_info-details_value">
          {data.details.operatorsName}
        </span>
      </div>
    }
    {
      data.details.email &&
      <div>
        {I18n.t('COMMON.EMAIL')}:
        <span className="feed-item_info-details_value">
          {data.details.email}
        </span>
      </div>
    }
    {
      data.details.phone &&
      <div>
        {I18n.t('COMMON.PHONE')}:
        <span className="feed-item_info-details_value">
          {data.details.phone}
        </span>
      </div>
    }
    {
      data.details.department &&
      <div>
        {I18n.t('COMMON.DEPARTMENT')}:
        <span className="feed-item_info-details_value">
          {
            rolesLabels[data.details.department]
              ? I18n.t(rolesLabels[data.details.department])
              : data.details.role
          }
        </span>
      </div>
    }
    {
      data.details.role &&
      <div>
        {I18n.t('COMMON.ROLE')}:
        <span className="feed-item_info-details_value">
          {
            rolesLabels[data.details.role]
              ? I18n.t(rolesLabels[data.details.role])
              : data.details.role
          }
        </span>
      </div>
    }
    {
      data.details.invitationSent !== undefined &&
      <div>
        {I18n.t('FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT')}:
        <span className="feed-item_info-details_value">
          {
            data.details.invitationSent
              ? I18n.t('FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT_SUCCESS')
              : I18n.t('FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT_FAILURE')
          }
        </span>
      </div>
    }
  </div>
);
FeedInfoOperatorCreation.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoOperatorCreation;
