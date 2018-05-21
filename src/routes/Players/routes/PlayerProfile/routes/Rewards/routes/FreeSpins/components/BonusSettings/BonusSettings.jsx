import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../../../components/Amount';

class BonusSettings extends PureComponent {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
  };

  render() {
    const { freeSpin } = this.props;

    return (
      <div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.BONUS_SETTINGS.MULTIPLIER')}
          {': '}
          <span className="font-weight-700">{freeSpin.linesPerSpin}</span>
        </div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.BONUS_SETTINGS.PRIZE')}
          {': '}
          {
            freeSpin.prize
              ? <Amount className="font-weight-700" {...freeSpin.prize} />
              : <span>&mdash;</span>
          }
        </div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.BONUS_SETTINGS.CAPPING')}
          {': '}
          {
            freeSpin.capping
              ? <Amount className="font-weight-700" {...freeSpin.capping} />
              : <span>&mdash;</span>
          }
        </div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.BONUS_SETTINGS.LIFE_TIME')}
          {': '}
          <span className="font-weight-700">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.BONUS_SETTINGS.LIFE_TIME_DAYS', { count: freeSpin.bonusLifeTime })}
          </span>
        </div>
      </div>
    );
  }
}

export default BonusSettings;
