import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ShortLoader from 'components/ShortLoader';
import './Button.scss';

class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool,
    common: PropTypes.bool,
    commonOutline: PropTypes.bool,
    primary: PropTypes.bool,
    primaryOutline: PropTypes.bool,
    danger: PropTypes.bool,
    verified: PropTypes.bool,
    transparent: PropTypes.bool,
    dangerOutline: PropTypes.bool,
    onClick: PropTypes.func,
    small: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    type: 'button',
    submitting: false,
    disabled: false,
    common: false,
    commonOutline: false,
    primary: false,
    primaryOutline: false,
    dangerOutline: false,
    danger: false,
    verified: false,
    transparent: false,
    onClick: () => {},
    small: false,
  };

  /**
   * Should be here to prevent synthetic event errors
   */
  onClick = () => {
    this.props.onClick();
  };

  render() {
    const {
      children,
      className,
      submitting,
      disabled,
      common,
      commonOutline,
      primary,
      primaryOutline,
      danger,
      dangerOutline,
      verified,
      transparent,
      small,
      ...props
    } = this.props;

    return (
      <button
        type="button"
        {...props}
        onClick={this.onClick}
        className={
          classNames(
            'Button',
            className,
            {
              'Button--common': common,
              'Button--common-outline': commonOutline,
              'Button--primary': primary,
              'Button--primary-outline': primaryOutline,
              'Button--danger-outline': dangerOutline,
              'Button--danger': danger,
              'Button--verified': verified,
              'Button--transparent': transparent,
              'Button--small': small,
            },
          )
        }
        disabled={submitting || disabled}
      >
        <Choose>
          <When condition={submitting}>
            <ShortLoader height={18} />
          </When>
          <Otherwise>
            {children}
          </Otherwise>
        </Choose>
      </button>
    );
  }
}

export default Button;
