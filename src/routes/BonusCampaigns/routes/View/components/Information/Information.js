import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import UnitValue from '../UnitValue';
import './Information.scss';

class Information extends Component {
  static propTypes = {
    data: PropTypes.shape({
      targetType: PropTypes.bonusCampaignEntity.targetType,
      totalSelectedPlayers: PropTypes.bonusCampaignEntity.totalSelectedPlayers,
      totalOptInPlayers: PropTypes.bonusCampaignEntity.totalOptInPlayers,
      startDate: PropTypes.bonusCampaignEntity.startDate,
      endDate: PropTypes.bonusCampaignEntity.endDate,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      currency: PropTypes.bonusCampaignEntity.currency,
      capping: PropTypes.bonusCampaignEntity.capping,
      wagerWinMultiplier: PropTypes.bonusCampaignEntity.wagerWinMultiplier,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      eventsType: PropTypes.bonusCampaignEntity.eventsType,
    }),
  };

  render() {
    const {
      data: {
        targetType,
        totalSelectedPlayers,
        totalOptInPlayers,
        startDate,
        endDate,
        conversionPrize,
        currency,
        capping,
        wagerWinMultiplier,
        campaignRatio,
        eventsType,
      },
    } = this.props;

    return (
      <div className="bonus__campaign__details row">
        <div className="col-md-3">
          <div className="bonus__campaign__details_block">
            <span className="bonus__campaign__details-label">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.TARGET')}
            </span>
            <div className="panel">
              <div className="panel-body height-200">
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.TARGET_TYPE')}</strong>:{' '}
                  {targetType}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.PLAYERS_SELECTED')}</strong>:{' '}
                  {totalSelectedPlayers}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.PLAYERS_OPT_IN')}</strong>:{' '}
                  {totalOptInPlayers}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bonus__campaign__details_block">
            <span className="bonus__campaign__details-label">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.REWARD_PARAMS')}
            </span>
            <div className="panel">
              <div className="panel-body height-200">
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.FULFILLMENT_TYPE')}:</strong>{' '}
                  {eventsType.join(', ')}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.RATIO')}:</strong> {' '}
                  <UnitValue {...campaignRatio} currency={currency} />
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.MULTIPLAYER')}: x</strong>
                  {wagerWinMultiplier}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.LIFE_TIME')}:</strong>{' '}
                  { moment().isSameOrAfter(endDate) ? 0 : moment(endDate).fromNow() }
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAMPAIGN_START')}:</strong>{' '}
                  {moment(startDate).format('DD.MM.YYYY HH:mm')}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAMPAIGN_END')}:</strong>{' '}
                  {moment(endDate).format('DD.MM.YYYY HH:mm')}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.PRIZE')}:</strong>{' '}
                  <UnitValue {...conversionPrize} currency={currency} />
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAPPING')}:</strong>{''}
                  <UnitValue {...capping} currency={currency} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Information;
