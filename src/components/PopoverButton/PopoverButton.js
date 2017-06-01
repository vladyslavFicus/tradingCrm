import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PopoverButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = () => {
    this.props.onClick(this.props.id);
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <span {...rest} onClick={this.handleClick}>
        {children}
      </span>
    );
  }
}

export default PopoverButton;

PopoverButton.propTypes = {
  children: PropTypes.node,
};
