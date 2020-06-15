import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PopoverButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  handleClick = (e) => {
    e.stopPropagation();

    const { onClick, id } = this.props;

    onClick(id, { id });
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
