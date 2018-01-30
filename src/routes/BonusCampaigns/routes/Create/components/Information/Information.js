import React from 'react';
import { I18n } from 'react-redux-i18n';
import Card, { Content } from '../../../../../../components/Card';

const Information = () => (
  <div className="account-details">
    <div className="row">
      <div className="col-md-3">
        <div className="bonus__campaign__target">
          <span className="account-details__label">
            {I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.TARGET')}
          </span>
          <Card>
            <Content>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.TARGET_TYPE')}:</strong>{' '}-
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.PLAYERS_SELECTED')}:</strong>{' '}
                0
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.PLAYERS_OPT_IN')}:</strong>{' '}
                0
              </div>
            </Content>
          </Card>
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
                -
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.RATIO')}:</strong> {' '}
                -
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.MULTIPLAYER')}: </strong>
                {0}
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.LIFE_TIME')}:</strong>{' '}
                 -
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAMPAIGN_START')}:</strong>{' '}
                -
              </div>
              <div>
                <strong>{I18n.t('BONUS_CAMPAIGNS.VIEW.DETAILS.LABEL.CAMPAIGN_END')}:</strong>{' '}
                -
              </div>
            </Content>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export default Information;
