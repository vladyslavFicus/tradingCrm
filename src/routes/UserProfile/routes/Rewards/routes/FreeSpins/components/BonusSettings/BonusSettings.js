import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import MultiCurrencyView from '../../../../../../../../components/MultiCurrencyView';
import renderLabel from '../../../../../../../../utils/renderLabel';
import {
  lockAmountStrategyLabels,
  moneyTypeUsageLabels,
} from '../../../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../../../constants/form';

class BonusSettings extends Component {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
    rates: PropTypes.arrayOf(PropTypes.price).isRequired,
  };

  render() {
    const {
      freeSpin: { bonus },
      rates,
    } = this.props;

    return (
      <div>
        <div>
          {I18n.t('FREE_SPIN.BONUS.GRANT')} {': '}
          <Choose>
            <When condition={bonus.grantRatioAbsolute}>
              <MultiCurrencyView
                id="bonus-grantRatioAbsolute"
                values={bonus.grantRatioAbsolute}
                rates={rates}
              />
            </When>
            <Otherwise>
              {bonus.grantRatioPercentage}%
            </Otherwise>
          </Choose>
        </div>
        <If condition={bonus.maxGrantAmount}>
          <div>
            {I18n.t('FREE_SPIN.BONUS.MAX_GRANT_AMOUNT')} {': '}
            <MultiCurrencyView id="bonus-maxGrantAmount" values={bonus.maxGrantAmount} rates={rates} />
          </div>
        </If>
        <div>
          {I18n.t('FREE_SPIN.BONUS.WAGERING_REQUIREMENT')} {': '}
          <Choose>
            <When
              condition={bonus.wageringRequirementAbsolute || bonus.wageringRequirementPercentage !== null}
            >
              <Choose>
                <When condition={bonus.wageringRequirementType === customValueFieldTypes.ABSOLUTE}>
                  <MultiCurrencyView
                    id="bonus-wageringRequirementAbsolute"
                    values={bonus.wageringRequirementAbsolute}
                    rates={rates}
                  />
                </When>
                <Otherwise>
                  {bonus.wageringRequirementPercentage}%
                </Otherwise>
              </Choose>
            </When>
            <Otherwise>
              -
            </Otherwise>
          </Choose>
        </div>
        <div>
          {I18n.t('FREE_SPIN.BONUS.MONEY_PRIORITY')} {': '}
          <div>
            {renderLabel(bonus.moneyTypePriority, moneyTypeUsageLabels)}
          </div>
        </div>
        <If condition={bonus.maxBet}>
          {I18n.t('FREE_SPIN.BONUS.MAX_BET')} {': '}
          <MultiCurrencyView id="bonus-maxBet" values={bonus.maxBet} rates={rates} />
        </If>
        <div>
          {I18n.t('FREE_SPIN.BONUS.BONUS_LIFETIME')} {': '}
          {I18n.t('FREE_SPIN.BONUS.LIFE_TIME_DAYS', { count: bonus.bonusLifeTime })}
        </div>
        <div>
          {I18n.t('FREE_SPIN.BONUS.LOCK_AMOUNT_STRATEGY')} {': '}
          {renderLabel(bonus.lockAmountStrategy, lockAmountStrategyLabels)}
        </div>
        <div>
          {I18n.t('FREE_SPIN.BONUS.PRIZE')} {': '}
          <Choose>
            <When condition={bonus.prizeAbsolute || bonus.prizePercentage !== null}>
              <Choose>
                <When condition={bonus.prizeAbsolute}>
                  <MultiCurrencyView
                    id="bonusSettings-prizeAbsolute"
                    values={bonus.prizeAbsolute}
                    rates={rates}
                  />
                </When>
                <Otherwise>
                  {bonus.prizePercentage}%
                </Otherwise>
              </Choose>
            </When>
          </Choose>
        </div>
        <div>
          {I18n.t('FREE_SPIN.BONUS.CAPPING')} {': '}
          <Choose>
            <When condition={bonus.cappingAbsolute || bonus.cappingPercentage !== null}>
              <Choose>
                <When condition={bonus.cappingAbsolute}>
                  <MultiCurrencyView
                    id="bonusSettings-cappingAbsolute"
                    values={bonus.cappingAbsolute}
                    rates={rates}
                  />
                </When>
                <Otherwise>
                  {bonus.cappingPercentage}%
                </Otherwise>
              </Choose>
            </When>
          </Choose>
        </div>
        <div>
          {I18n.t('FREE_SPIN.BONUS.CLAIMABLE')} {': '}
          <Choose>
            <When condition={bonus.claimable}>
              {I18n.t('COMMON.YES')}
            </When>
            <Otherwise>
              {I18n.t('COMMON.NO')}
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default BonusSettings;
