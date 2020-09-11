import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ReactSwitch.scss';

class ReactSwitch extends Component {
  static propTypes = {
    on: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
  };

  static defaultProps = {
    id: null,
    on: false,
    className: '',
    disabled: false,
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

  handleClick = () => {
    this.setState(({ on }) => ({ on: !on }), () => {
      this.props.onClick(this.state.on);
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
