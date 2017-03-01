import React, { Component, PropTypes } from 'react';

class NoteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.any,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: <i className="fa fa-sticky-note"/>,
  };

  handleClick = (e) => {
    this.props.onClick(this.props.id);
  };

  render() {
    const { label, onClick, ...rest } = this.props;

    return (
      <span onClick={this.handleClick} {...rest}>
        {label}
      </span>
    );
  }
}

export default NoteButton;
