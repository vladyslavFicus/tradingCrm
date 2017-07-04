import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import PopoverButton from '../PopoverButton';

class NoteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    note: PropTypes.noteEntity,
    onClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: 'cursor-pointer margin-right-5',
    note: null,
  };

  handleClick = (id) => {
    this.props.onClick(id, this.props.note);
  };

  render() {
    const { note, ...rest } = this.props;
    let iconNode = <i className="note-icon note-add-note" />;

    if (note) {
      iconNode = note.pinned
        ? <i className="note-icon note-pinned-note" />
        : <i className="note-icon note-with-text" />;
    }

    return (
      <PopoverButton {...rest} onClick={this.handleClick}>
        {iconNode}
      </PopoverButton>
    );
  }
}

export default NoteButton;
