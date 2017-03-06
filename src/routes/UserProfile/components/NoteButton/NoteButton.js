import React, { Component, PropTypes } from 'react';

class NoteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = () => {
    this.props.onClick(this.props.id);
  };

  render() {
    const { children, onClick, ...rest } = this.props;

    return (
      <span onClick={this.handleClick} {...rest}>
        {children}
      </span>
    );
  }
}

export default NoteButton;
