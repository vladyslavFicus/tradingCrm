import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../components/Amount';

class FreeSpinSettings extends Component {
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
      },
    } = this.props;

    return (
      <div>
        {
          freeSpinsAmount &&
          <div>
            {I18n.t('FREE_SPIN.FREE_SPIN_AMOUNT')} {': '}
            {freeSpinsAmount}
          </div>
        }
        {
          coinSize &&
          <div>
            {I18n.t('FREE_SPIN.COIN_SIZE')} {': '}
            {coinSize}
          </div>
        }
        {
          betMultiplier &&
          <div>
            {I18n.t('FREE_SPIN.BET_MULTIPLIER')} {': '}
            {betMultiplier}
          </div>
        }
        {
          rhfpBet &&
          <div>
            {I18n.t('FREE_SPIN.RHFP_BET')} {': '}
            {rhfpBet}
          </div>
        }
        {
          !!linesPerSpin &&
          <Fragment>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.LINES')}
            {': '}
            <span className="font-weight-700">{linesPerSpin}</span>
          </Fragment>
        }
        {
          betPrice &&
          <div>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.BET_PER_LINE')}
            {': '}
            <Amount className="font-weight-700" amount={betPrice} currency={currencyCode} />
          </div>
        }
        {
          betPrice && linesPerSpin &&
          <div>
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.SPIN_VALUE')}
            {': '}
            <Amount className="font-weight-700" amount={betPrice * linesPerSpin} currency={currencyCode} />
          </div>
        }
      </div>
    );
  }
}

export default FreeSpinSettings;
