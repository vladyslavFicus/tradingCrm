import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Badge.scss';

class Badge extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    warning: PropTypes.bool,
    success: PropTypes.bool,
    danger: PropTypes.bool,
    center: PropTypes.bool,
    info: PropTypes.bool,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
  };

  static defaultProps = {
    warning: false,
    success: false,
    danger: false,
    center: false,
    info: false,
    color: null,
    backgroundColor: null,
  };

  render() {
    const {
      children,
      warning,
      success,
      danger,
      center,
      text,
      info,
      color,
      backgroundColor,
    } = this.props;

    return (
      <div className="Badge">
        <div className="Badge__children">{children}</div>
        <div
          className={classNames('Badge__item', {
            'Badge__item--info': info,
            'Badge__item--warning': warning,
            'Badge__item--danger': danger,
            'Badge__item--success': success,
            'Badge__item--center': center,
          })}
          style={{ backgroundColor, color }}
        >
          {text}
        </div>
      </div>
    );
  }
}

export default Badge;
