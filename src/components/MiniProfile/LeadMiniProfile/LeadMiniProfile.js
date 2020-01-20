import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import ShortLoader from 'components/ShortLoader';
import { salesStatusesColor } from 'constants/salesStatuses';
import { withRequests } from 'apollo';
import LeadMiniProfileQuery from './graphql/LeadMiniProfileQuery';

const LeadMiniProfile = ({ miniProfile: { data, loading } }) => {
  if (loading) {
    return (
      <div className="mini-profile-loader mini-profile-loader-lead">
        <ShortLoader height={40} />
      </div>
    );
  }

  const {
    leadProfile: {
      data: {
        registrationDate,
        salesStatus,
        salesAgent,
        language,
        surname,
        country,
        mobile,
        phone,
        name,
        uuid,
      },
    },
  } = data;

  const salesAgentFullName = salesAgent ? salesAgent.fullName : '';

  return (
    <div className="mini-profile mini-profile dormant">
      <div className="mini-profile-header">
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.LEADS.LEAD')}</div>
        <div className="mini-profile-title">
          <span className="font-weight-700">
            {name} {surname}
          </span>
        </div>
        <div className="mini-profile-ids">
          <Uuid uuid={uuid} />
          {` - ${language}`}
        </div>
      </div>
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.COUNTRY')}</div>
          <div className="info-block-content">
            <CountryLabelWithFlag code={country} height="14" languageCode={language} />
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.SALES')}</div>
          <div className="info-block-content">
            <div className={classNames('font-weight-700', salesStatusesColor[salesStatus])}>{salesStatus}</div>
            <div className="font-size-11">{salesAgentFullName}</div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.LEAD_CREATED')}</div>
          <div className="info-block-content">
            {moment.utc(registrationDate).local().fromNow()}
          </div>
        </div>
      </div>
      <div className="mini-profile-footer">
        <div className="info-block">
          <div className="info-block-label-footer">{I18n.t('MINI_PROFILE.LEADS.PHONE')}</div>
          <div className="info-block-content-footer">{phone || mobile}</div>
        </div>
      </div>
    </div>
  );
};

LeadMiniProfile.propTypes = {
  miniProfile: PropTypes.shape({
    data: PropTypes.shape({
      leadProfile: PropTypes.shape({
        data: PropTypes.lead,
      }),
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withRequests({
  miniProfile: LeadMiniProfileQuery,
})(LeadMiniProfile);
