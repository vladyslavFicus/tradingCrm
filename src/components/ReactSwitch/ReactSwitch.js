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
  };
  static defaultProps = {
    className: 'react-switch',
    disabled: false,
  };

  render() {
    const { className, onClick, on, disabled } = this.props;
    return (
      <div
        className={classNames(className, { 'is-disabled': disabled, on })}
        onClick={onClick}
      >
        <div className="switch-toggle" />
      </div>
    );
  }
}

export default ReactSwitch;
