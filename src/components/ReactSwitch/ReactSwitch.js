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
  };

  static defaultProps = {
    id: null,
    on: false,
    className: '',
    disabled: false,
    stopPropagation: false,
    onClick: () => {},
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
    } = this.props;

    const { on } = this.state;

    return (
      <button
        type="button"
        disabled={disabled}
        className={classNames('react-switch', className, { 'is-disabled': disabled, on })}
        onClick={this.handleClick}
        id={id}
      >
        <div className="switch-toggle" />
      </button>
    );
  }
}

export default ReactSwitch;
