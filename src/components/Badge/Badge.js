import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Badge.scss';

class Badge extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    info: PropTypes.bool,
    warning: PropTypes.bool,
    danger: PropTypes.bool,
    success: PropTypes.bool,
    center: PropTypes.bool,
  };

  static defaultProps = {
    info: false,
    warning: false,
    danger: false,
    success: false,
    center: false,
  };

  render() {
    const {
      children,
      text,
      info,
      warning,
      danger,
      success,
      center,
    } = this.props;

    return (
      <div className="Badge">
        <div className="Badge__children">{children}</div>
        <div className={classNames('Badge__item', {
          'Badge__item--info': info,
          'Badge__item--warning': warning,
          'Badge__item--danger': danger,
          'Badge__item--success': success,
          'Badge__item--center': center,
        })}
        >
          {text}
        </div>
      </div>
    );
  }
}

export default Badge;
