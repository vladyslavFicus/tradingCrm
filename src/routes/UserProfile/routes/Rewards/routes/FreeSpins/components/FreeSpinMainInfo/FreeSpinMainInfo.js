import React, { Component } from 'react';
import classNames from 'classnames';
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
          <Uuid uuid={freeSpin.uuid} />
        </div>
        <div className="font-size-11">
          by <Uuid uuid={freeSpin.authorUUID} />
        </div>
      </div>
    );
  }
}

export default FreeSpinMainInfo;
