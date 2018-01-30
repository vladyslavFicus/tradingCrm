import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import UnitValue from '../UnitValue';
import { targetTypesLabels, fulfilmentTypesLabels } from '../../../../../../constants/bonus-campaigns';
import renderLabel from '../../../../../../utils/renderLabel';
import Card, { Content } from '../../../../../../components/Card';

const Information = (props) => {
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
      fulfilmentType,
    },
  } = props;

  return (
    <div className="account-details">
      <div className="row">
        <div className="col-md-3">
          <div className="bonus__campaign__target">
            <span className="account-details__label">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.TARGET')}
            </span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bonus__campaign__fulfillment-reward">
            <span className="account-details__label">
              {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.REWARD_PARAMS')}
            </span>
            <Card>
              <Content>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.FULFILLMENT_TYPE')}:</strong>{' '}
                  {renderLabel(fulfilmentType, fulfilmentTypesLabels)}
                </div>

                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.MULTIPLAYER')}: x</strong>
                  {wagerWinMultiplier}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.LIFE_TIME')}:</strong>{' '}
                  {moment().isSameOrAfter(endDate) ? 0 : moment.utc(endDate).fromNow()}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAMPAIGN_START')}:</strong>{' '}
                  {moment.utc(startDate).local().format('DD.MM.YYYY HH:mm')}
                </div>
                <div>
                  <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAMPAIGN_END')}:</strong>{' '}
                  {moment.utc(endDate).local().format('DD.MM.YYYY HH:mm')}
                </div>
                {
                  conversionPrize &&
                  <div>
                    <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.PRIZE')}:</strong>{' '}
                    <UnitValue {...conversionPrize} currency={currency} />
                  </div>
                }
                {
                  capping &&
                  <div>
                    <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAPPING')}:</strong>{' '}
                    <UnitValue {...capping} currency={currency} />
                  </div>
                }
              </Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

Information.propTypes = {
  data: PropTypes.bonusCampaignEntity.isRequired,
};

export default Information;
