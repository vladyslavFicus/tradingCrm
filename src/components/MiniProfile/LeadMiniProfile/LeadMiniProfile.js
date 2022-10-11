import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import ShortLoader from 'components/ShortLoader';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import renderLabel from 'utils/renderLabel';
import LeadMiniProfileQuery from './graphql/LeadMiniProfileQuery';

const LeadMiniProfile = ({ miniProfile: { data, loading } }) => {
  if (loading) {
    return (
      <div className="mini-profile-loader mini-profile-loader-lead">
        <ShortLoader />
      </div>
    );
  }

  const {
    lead: {
      registrationDate,
      language,
      surname,
      country,
      name,
      uuid,
      acquisition,
    },
  } = data;
  const { salesStatus, salesOperator } = acquisition || {};

  const salesAgentFullName = salesOperator ? salesOperator.fullName : '';

  return (
    <div className="mini-profile mini-profile dormant">
      <div className="mini-profile-header">
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.LEADS.LEAD')}</div>
        <div className="mini-profile-title">
          <span className="mini-profile-title-name">
            {name} {surname}
          </span>
        </div>
        <div className="mini-profile-ids">
          <Uuid uuid={uuid} />
          {` - ${language}`}
        </div>
      </div>
      <table className="mini-profile-content">
        <tbody>
          <tr className="info-block">
            <td className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.COUNTRY')}</td>
            <td className="info-block-content">
              <CountryLabelWithFlag code={country} height="14" languageCode={language} />
            </td>
          </tr>
          <tr className="info-block">
            <td className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.SALES')}</td>
            <td className="info-block-content">
              <div className={classNames('font-weight-700', salesStatusesColor[salesStatus])}>
                {I18n.t(renderLabel(salesStatus, salesStatuses))}
              </div>
              <div>{salesAgentFullName}</div>
            </td>
          </tr>
          <tr className="info-block">
            <td className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.LEAD_CREATED')}</td>
            <td className="info-block-content">
              {moment.utc(registrationDate).local().fromNow()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

LeadMiniProfile.propTypes = {
  miniProfile: PropTypes.shape({
    data: PropTypes.shape({
      lead: PropTypes.lead,
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default compose(
  withRequests({
    miniProfile: LeadMiniProfileQuery,
  }),
)(LeadMiniProfile);
