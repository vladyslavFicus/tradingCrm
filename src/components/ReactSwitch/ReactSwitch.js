import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ReactSwitch.scss';

class ReactSwitch extends Component {
  static propTypes = {
    on: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
  };
  static defaultProps = {
    className: 'react-switch',
    isDisabled: false,
  };

  render() {
    const { className, onClick, on, isDisabled } = this.props;
    return (
      <div
        className={classNames(className, { 'is-disabled': isDisabled, on })}
        onClick={onClick}
      >
        <div className="switch-toggle" />
      </div>
    );
  }
}

export default ReactSwitch;
