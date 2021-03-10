import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ReactSwitch.scss';

class ReactSwitch extends PureComponent {
  static propTypes = {
    on: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    stopPropagation: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    labelPosition: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  };

  static defaultProps = {
    id: null,
    on: false,
    className: '',
    disabled: false,
    stopPropagation: false,
    onClick: () => {},
    label: null,
    labelPosition: 'right',
  };

  state = {
    on: this.props.on,
    propsOn: this.props.on,
  };

  static getDerivedStateFromProps(props, state) {
    return {
      on: state.propsOn !== props.on ? props.on : state.on,
      propsOn: props.on,
    };
  }

  handleClick = (e) => {
    const { onClick, stopPropagation } = this.props;

    if (stopPropagation) {
      e.stopPropagation();
    }

    this.setState(({ on }) => ({ on: !on }), async () => {
      try {
        await onClick(this.state.on);
      } catch (_) {
        // Revert changes if error has occurred
        this.setState(({ on }) => ({ on: !on }));
      }
    });
  };

  render() {
    const {
      id,
      disabled,
      className,
      label,
      labelPosition,
    } = this.props;

    const { on } = this.state;

    return (
      <label className={classNames(
        'ReactSwitch',
        className,
        {
          'ReactSwitch--label-top': labelPosition === 'top',
          'ReactSwitch--label-bottom': labelPosition === 'bottom',
          'ReactSwitch--label-right': labelPosition === 'right',
          'ReactSwitch--label-left': labelPosition === 'left',
        },
      )}
      >
        <button
          type="button"
          disabled={disabled}
          className={classNames(
            'ReactSwitch__button',
            {
              'ReactSwitch__button--disabled': disabled,
              'ReactSwitch__button--on': on,
            },
          )}
          onClick={this.handleClick}
          id={id}
        >
          <div className="ReactSwitch__switch-toggle" />
        </button>

        <If condition={label}>
          <span className="ReactSwitch__label">{label}</span>
        </If>
      </label>
    );
  }
}

export default ReactSwitch;
