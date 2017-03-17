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
    const { children, ...rest } = this.props;

    return (
      <span {...rest} onClick={this.handleClick}>
        {children}
      </span>
    );
  }
}

export default NoteButton;

NoteButton.propTypes = {
  children: PropTypes.node,
};
