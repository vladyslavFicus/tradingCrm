import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import { departmentsLabels, rolesLabels } from '../../constants/operators';

const FeedInfoOperatorCreation = ({ data }) => (
  <Fragment>
    <If condition={data.details.operatorsName}>
      {I18n.t('FEED_ITEM.OPERATOR_CREATION.OPERATOR_NAME')}:
      <span className="feed-item__content-value">
        {data.details.operatorsName}
      </span>
      <br />
    </If>
    <If condition={data.details.email}>
      {I18n.t('COMMON.EMAIL')}:
      <span className="feed-item__content-value">
        {data.details.email}
      </span>
      <br />
    </If>
    <If condition={data.details.phone}>
      {I18n.t('COMMON.PHONE')}:
      <span className="feed-item__content-value">
        {data.details.phone}
      </span>
      <br />
    </If>
    <If condition={data.details.department}>
      {I18n.t('COMMON.DEPARTMENT')}:
      <span className="feed-item__content-value">
        <Choose>
          <When condition={departmentsLabels[data.details.department]}>
            {I18n.t(departmentsLabels[data.details.department])}
          </When>
          <Otherwise>
            {data.details.department}
          </Otherwise>
        </Choose>
      </span>
      <br />
    </If>
    <If condition={data.details.role}>
      {I18n.t('COMMON.ROLE')}:
      <span className="feed-item__content-value">
        <Choose>
          <When condition={rolesLabels[data.details.role]}>
            {I18n.t(rolesLabels[data.details.role])}
          </When>
          <Otherwise>
            {data.details.role}
          </Otherwise>
        </Choose>
      </span>
      <br />
    </If>
    <If condition={data.details.invitationSent !== undefined}>
      {I18n.t('FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT')}:
      <span className="feed-item__content-value">
        <Choose>
          <When condition={JSON.parse(data.details.invitationSent)}>
            {I18n.t('FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT_SUCCESS')}
          </When>
          <Otherwise>
            {I18n.t('FEED_ITEM.OPERATOR_CREATION.INVITATION_SENT_FAILURE')}
          </Otherwise>
        </Choose>
      </span>
    </If>
  </Fragment>
);

FeedInfoOperatorCreation.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoOperatorCreation;
