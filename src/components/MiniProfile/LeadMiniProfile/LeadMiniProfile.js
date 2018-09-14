import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import Uuid from '../../Uuid';
import GridCountryFlag from '../../GridCountryFlag';
import { salesStatusesColor } from '../../../constants/salesStatuses';
import './LeadMiniProfile.scss';

const LeadMiniProfile = ({ data }) => {
  const salesStatusClassName = salesStatusesColor[data.salesStatus];
  return (
    <div className="mini-profile mini-profile dormant">
      <div className="mini-profile-header">
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.LEADS.LEAD')}</div>
        <div className="mini-profile-title">
          <span className="font-weight-700">{data.name} {data.surname}</span>
        </div>
        <div className="mini-profile-ids">
          <Uuid uuid={data.id} />
          {` - ${data.language}`}
        </div>
      </div>
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.COUNTRY')}</div>
          <div className="info-block-content">
            <GridCountryFlag
              code={data.country}
              height="14"
              languageCode={data.language}
            />
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.SALES')}</div>
          <div className="info-block-content">
            <div className={classNames('font-weight-700', { [salesStatusClassName]: salesStatusClassName })}>
              {data.salesStatus}
            </div>
            <div className="font-size-11">{data.salesAgent}</div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LEADS.LEAD_CREATED')}</div>
          <div className="info-block-content">{moment.utc(data.registrationDate).local().fromNow()}</div>
        </div>
      </div>
      <div className="mini-profile-footer">
        <div className="info-block">
          <div className="info-block-label-footer">Phone:</div>
          <div className="info-block-content-footer">{data.phone || data.mobile}</div>
        </div>
      </div>
    </div>
  );
};

LeadMiniProfile.propTypes = {
  data: PropTypes.lead.isRequired,
};

export default LeadMiniProfile;
