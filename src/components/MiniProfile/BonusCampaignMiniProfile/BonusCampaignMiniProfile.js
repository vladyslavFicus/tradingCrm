import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../constants/propTypes';
import { campaignStatusNames } from '../constants';
import { statuses, targetTypesLabels, campaignTypesLabels } from '../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../constants/form';
import Uuid from '../../Uuid';
import renderLabel from '../../../utils/renderLabel';
import './BonusCampaignMiniProfile.scss';

const BonusCampaignMiniProfile = ({ data }) => (
  <div className={`mini-profile campaign-mini-profile ${data.stateReason ? campaignStatusNames.CANCELED : campaignStatusNames[data.state]}`}>
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
          <div>
            {I18n.t('MINI_PROFILE.CANCELED')}
            {` ${I18n.t('COMMON.AUTHOR_BY')} `}
            <Uuid uuid={data.statusChangedAuthorUUID} uuidPrefix="OP" />
            {` ${I18n.t('COMMON.DATE_ON', { date: moment.utc(data.statusChangedDate).local().format('DD.MM.YYYY HH:mm') })}`}
          </div>
        }
        {
          data.state === statuses.DRAFT &&
          <div>
            {I18n.t('MINI_PROFILE.CREATED')}
            {` ${I18n.t('COMMON.AUTHOR_BY')} `}
            <Uuid uuid={data.authorUUID} uuidPrefix="OP" />
            {` ${I18n.t('COMMON.DATE_ON', { date: moment.utc(data.creationDate).local().format('DD.MM.YYYY HH:mm') })}`}
          </div>
        }
        {
          (data.state !== statuses.DRAFT && !data.stateReason) &&
          <div>
            {I18n.t('MINI_PROFILE.LAUNCHED')}
            {` ${I18n.t('COMMON.AUTHOR_BY')} `}
            <Uuid uuid={data.statusChangedAuthorUUID} uuidPrefix="OP" />
            {` ${I18n.t('COMMON.DATE_ON', { date: moment.utc(data.statusChangedDate).local().format('DD.MM.YYYY HH:mm') })}`}
          </div>
        }
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
        <div className="info-block-label">{I18n.t('MINI_PROFILE.TARGET')}</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            {renderLabel(data.targetType, targetTypesLabels)}
          </div>
          <div className="info-block-description">
            {I18n.t('MINI_PROFILE.OPTED_IN', { value: data.totalOptInPlayers })}
          </div>
          <div className="info-block-description">
            {I18n.t('MINI_PROFILE.SELECTED', { value: data.totalSelectedPlayers })}
          </div>
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.FULFILLMENT')}</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            {renderLabel(data.campaignType, campaignTypesLabels)}
          </div>
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.REWARD')}</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            {I18n.t('MINI_PROFILE.BONUS')}
          </div>
          <div className="info-block-description">
            {
              data.campaignRatio.type === customValueFieldTypes.ABSOLUTE &&
              <span>
                {`${data.campaignRatio.value} ${data.currency}`}
              </span>
            }
            {
              data.campaignRatio.type === customValueFieldTypes.PERCENTAGE &&
              <span>
                {`${data.campaignRatio.value} %`}
              </span>
            }
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
