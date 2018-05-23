import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../../../components/Amount';

class FreeSpinSettings extends PureComponent {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
  };

  render() {
    const {
      freeSpin: {
        betPrice,
        linesPerSpin,
        currencyCode,
        coinSize,
        betMultiplier,
        rhfpBet,
        freeSpinsAmount,
        claimable,
      },
    } = this.props;

    return (
      <div>
        <If condition={freeSpinsAmount}>
          <div>
            {I18n.t('FREE_SPIN.FREE_SPIN_AMOUNT')} {': '}
            {freeSpinsAmount}
          </div>
        </If>
        <If condition={coinSize}>
          <div>
            {I18n.t('FREE_SPIN.COIN_SIZE')} {': '}
            {coinSize}
          </div>
        </If>
        <If condition={betMultiplier}>
          <div>
            {I18n.t('FREE_SPIN.BET_MULTIPLIER')} {': '}
            {betMultiplier}
          </div>
        </If>
        <If condition={rhfpBet}>
          <div>
            {I18n.t('FREE_SPIN.RHFP_BET')} {': '}
            {rhfpBet}
          </div>
        </If>
        <If condition={linesPerSpin}>
          <div>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.LINES')}
            {': '}
            <span className="font-weight-700">{linesPerSpin}</span>
          </div>
        </If>
        <If condition={betPrice}>
          <div>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.BET_PER_LINE')}
            {': '}
            <Amount className="font-weight-700" amount={betPrice} currency={currencyCode} />
          </div>
        </If>
        <If condition={betPrice && linesPerSpin}>
          <div>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.SPIN_VALUE')}
            {': '}
            <Amount className="font-weight-700" amount={betPrice * linesPerSpin} currency={currencyCode} />
          </div>
        </If>
        <If condition={claimable}>
          <div>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.CLAIMABLE')}
            {': '}
            <Choose>
              <When condition={claimable}>
                {I18n.t('COMMON.YES')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.NO')}
              </Otherwise>
            </Choose>
          </div>
        </If>
      </div>
    );
  }
}

export default FreeSpinSettings;
