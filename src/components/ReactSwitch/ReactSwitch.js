import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ReactSwitch.scss';

class ReactSwitch extends Component {
  static propTypes = {
    on: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { className, onClick, on } = this.props;
    return (
      <div
        className={classNames('react-switch', className, { on })}
        onClick={onClick}
      >
        <div className="switch-toggle" />
      </div>
    );
  }
}

export default ReactSwitch;
