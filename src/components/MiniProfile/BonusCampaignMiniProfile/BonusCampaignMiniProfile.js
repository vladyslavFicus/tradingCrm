import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../constants/propTypes';
import { campaignStatusNames } from '../constants';
import { statuses, targetTypesLabels, campaignTypesLabels } from '../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../constants/form';
import Uuid from '../../Uuid';
import renderLabel from '../../../utils/renderLabel';
import Amount from '../../../components/Amount';
import './BonusCampaignMiniProfile.scss';

const BonusCampaignMiniProfile = ({ campaign }) => (
  <div className={
    `mini-profile campaign-mini-profile
    ${campaign.stateReason ? campaignStatusNames.CANCELED : campaignStatusNames[campaign.state]}`}
  >
    <div className="mini-profile-header">
      <label className="mini-profile-label">
        {`${campaign.stateReason ? campaignStatusNames.CANCELED : campaignStatusNames[campaign.state]}`}
      </label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.CAMPAIGN')}</div>
      <div className="mini-profile-title font-weight-700">{campaign.campaignName}</div>
      <div className="mini-profile-ids font-weight-700">
        <Uuid uuid={campaign.uuid} uuidPrefix="CA" />
        {' - '}
        {campaign.optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}
      </div>
      <div className="mini-profile-ids">
        {
          (campaign.cancellationReason && campaign.stateReason) &&
          <div>
            {I18n.t('MINI_PROFILE.CANCELED')}
            {` ${I18n.t('COMMON.AUTHOR_BY')} `}
            <Uuid uuid={campaign.statusChangedAuthorUUID} uuidPrefix="OP" />
            {` ${I18n.t('COMMON.DATE_ON', {
              date: moment.utc(campaign.statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
            })}`}
          </div>
        }
        {
          campaign.state === statuses.DRAFT &&
          <div>
            {I18n.t('MINI_PROFILE.CREATED')}
            {` ${I18n.t('COMMON.AUTHOR_BY')} `}
            <Uuid uuid={campaign.authorUUID} uuidPrefix="OP" />
            {` ${I18n.t('COMMON.DATE_ON',
              { date: moment.utc(campaign.creationDate).local().format('DD.MM.YYYY HH:mm') }
            )}`}
          </div>
        }
        {
          (campaign.state !== statuses.DRAFT && !campaign.stateReason) &&
          <div>
            {I18n.t('MINI_PROFILE.LAUNCHED')}
            {` ${I18n.t('COMMON.AUTHOR_BY')} `}
            <Uuid uuid={campaign.statusChangedAuthorUUID} uuidPrefix="OP" />
            {` ${I18n.t('COMMON.DATE_ON', {
              date: moment.utc(campaign.statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
            })}`}
          </div>
        }
      </div>
      <div className="mini-profile-ids">
        {`${I18n.t('MINI_PROFILE.DATE_RANGE')} `}
        {(campaign.startDate && campaign.endDate)
          ? `${moment.utc(campaign.startDate).local().format('DD.MM.YYYY')}
            -
            ${moment.utc(campaign.endDate).local().format('DD.MM.YYYY')}`
          : I18n.t('MINI_PROFILE.RANGE_NOT_SELECTED')
        }
      </div>
    </div>
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.TARGET')}</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            {renderLabel(campaign.targetType, targetTypesLabels)}
          </div>
          <div className="info-block-description">
            {I18n.t('MINI_PROFILE.OPTED_IN', { value: campaign.totalOptInPlayers })}
          </div>
          <div className="info-block-description">
            {I18n.t('MINI_PROFILE.SELECTED', { value: campaign.totalSelectedPlayers })}
          </div>
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.FULFILLMENT')}</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            {renderLabel(campaign.campaignType, campaignTypesLabels)}
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
              campaign.campaignRatio.type === customValueFieldTypes.ABSOLUTE &&
              <Amount amount={campaign.campaignRatio.value} currency={campaign.currency} />
            }
            {
              campaign.campaignRatio.type === customValueFieldTypes.PERCENTAGE &&
              <span>
                {`${campaign.campaignRatio.value} %`}
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
);

BonusCampaignMiniProfile.propTypes = {
  campaign: PropTypes.bonusCampaignEntity.isRequired,
};

export default BonusCampaignMiniProfile;
