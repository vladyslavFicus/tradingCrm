import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../constants/propTypes';
import { campaignStatusNames } from '../constants';
import { statuses } from '../../../constants/bonus-campaigns';
import Uuid from '../../Uuid';
import './BonusCampaignMiniProfile.scss';

const BonusCampaignMiniProfile = ({ data }) => (
  <div className={`mini-profile campaign-mini-profile ${data.stateReason ? campaignStatusNames.CANCELED : campaignStatusNames[data.state]}`}>
    {console.log(data)}
    <div className="mini-profile-header">
      <label className="mini-profile-label">
        {`${data.stateReason ? campaignStatusNames.CANCELED : campaignStatusNames[data.state]}`}
      </label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.CAMPAIGN')}</div>
      <div className="mini-profile-title font-weight-700">{data.campaignName}</div>
      <div className="mini-profile-ids font-weight-700">
        <Uuid uuid={data.uuid} uuidPrefix="CA" />
        {' - '}
        {data.optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}
      </div>
      <div className="mini-profile-ids">
        {
          data.stateReason &&
          I18n.t('MINI_PROFILE.CANCELED')
        }
        {
          data.state === statuses.DRAFT &&
          I18n.t('MINI_PROFILE.CREATED')
        }
        {
          (data.state !== statuses.draft && !data.stateReason) &&
          I18n.t('MINI_PROFILE.LAUNCHED')
        }
        {` ${I18n.t('COMMON.AUTHOR_BY')} `}
        <Uuid uuid={data.authorUUID} uuidPrefix="OP" />
        {` ${I18n.t('COMMON.DATE_ON', { date: moment.utc(data.creationDate).local().format('DD.MM.YYYY HH:mm') })}`}
      </div>
      <div className="mini-profile-ids">
        {`${I18n.t('MINI_PROFILE.DATE_RANGE')} `}
        {(data.startDate && data.endDate)
          ? `${moment.utc(data.startDate).local().format('DD.MM.YYYY')} - ${moment.utc(data.endDate).local().format('DD.MM.YYYY')}`
          : I18n.t('MINI_PROFILE.NOT_SELECTED')
        }
      </div>
    </div>
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">TARGET</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            Selected players
          </div>
          <div className="info-block-description">
            Opted-in 121 players
          </div>
          <div className="info-block-description">
            Selected 151 players
          </div>
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-label">FULFILLMENT</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            First deposit
          </div>
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-label">REWARD</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            Bonus
          </div>
          <div className="info-block-description">
            50% of deposit
          </div>
        </div>
      </div>
    </div>
  </div>
);

BonusCampaignMiniProfile.propTypes = {
  data: PropTypes.bonusCampaignEntity.isRequired,
};

export default BonusCampaignMiniProfile;
