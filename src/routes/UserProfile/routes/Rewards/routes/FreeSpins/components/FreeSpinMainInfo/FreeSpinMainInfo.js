import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import Uuid from '../../../../../../../../components/Uuid';

class FreeSpinMainInfo extends Component {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    onClick: null,
  };

  render() {
    const { freeSpin, onClick } = this.props;
    const isClickable = typeof onClick === 'function';
    const handleClick = onClick ? () => onClick(freeSpin) : onClick;

    return (
      <div>
        <div
          className={classNames('font-weight-700', { 'cursor-pointer': isClickable })}
          onClick={handleClick}
        >
          {freeSpin.name}
        </div>
        <div className="font-size-11">
          <Uuid uuidPartsCount={3} length={18} uuid={freeSpin.uuid} />
          <span className="mx-1">
            {I18n.t('COMMON.AUTHOR_BY')}
          </span>
          <Uuid uuid={freeSpin.authorUUID} />
        </div>
        {
          freeSpin.freeSpinTemplateUUID &&
          <div className="font-size-11">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_TEMPLATE')} {' - '}
            <Uuid uuidPartsCount={4} length={22} uuid={freeSpin.freeSpinTemplateUUID} />
          </div>
        }
        {
          freeSpin.bonusTemplateUUID &&
          <div className="font-size-11">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.BONUS_TEMPLATE')} {' - '}
            <Uuid uuidPartsCount={3} length={18} uuid={freeSpin.bonusTemplateUUID} />
          </div>
        }
      </div>
    );
  }
}

export default FreeSpinMainInfo;
