import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import ShortLoader from 'components/ShortLoader';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import renderLabel from 'utils/renderLabel';
import { hideText } from 'utils/hideText';
import LeadMiniProfileQuery from './graphql/LeadMiniProfileQuery';

const LeadMiniProfile = ({ miniProfile: { data, loading }, department }) => {
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
  const isPhoneHidden = getBrand().privatePhoneByDepartment.includes(department);

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
            <div className={classNames('font-weight-700', salesStatusesColor[salesStatus])}>
              {I18n.t(renderLabel(salesStatus, salesStatuses))}
            </div>
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
      <If condition={phone || mobile}>
        <div className="mini-profile-footer">
          <div className="info-block">
            <div className="info-block-label-footer">{I18n.t('MINI_PROFILE.LEADS.PHONE')}</div>
            <div className="info-block-content-footer">
              {(isPhoneHidden ? hideText(phone) : phone) || (isPhoneHidden ? hideText(mobile) : mobile)}
            </div>
          </div>
        </div>
      </If>
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
  department: PropTypes.string.isRequired,
};

export default compose(
  withRequests({
    miniProfile: LeadMiniProfileQuery,
  }),
)(LeadMiniProfile);
