import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as Icon } from './icon.svg';
import './NotificationCenterTrigger.scss';

class NotificationCenterTrigger extends PureComponent {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className, counter, ...props } = this.props;

    return (
      <button
        type="button"
        counter={counter}
        className={classNames(className, 'NotificationCenterTrigger', {
          'NotificationCenterTrigger--beep': counter,
        })}
        {...props}
      >
        <Icon className="NotificationCenterTrigger__icon" />
      </button>
    );
  }
}

export default NotificationCenterTrigger;
