import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ReactSwitch.scss';

class ReactSwitch extends Component {
  static propTypes = {
    on: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    id: null,
  };

  render() {
    const {
      className,
      onClick,
      on,
      disabled,
      id,
    } = this.props;

    return (
      <button
        type="button"
        className={classNames('react-switch', className, { 'is-disabled': disabled, on })}
        onClick={onClick}
        id={id}
      >
        <div className="switch-toggle" />
      </button>
    );
  }
}

export default ReactSwitch;
