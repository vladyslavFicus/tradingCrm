import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import PopoverButton from '../PopoverButton';

class NoteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    targetEntity: PropTypes.object,
    note: PropTypes.noteEntity,
    preview: PropTypes.bool,
    withMessage: PropTypes.bool,
    message: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: 'cursor-pointer margin-right-5',
    message: null,
    note: null,
    targetEntity: null,
    preview: false,
    withMessage: false,
  };

  handleClick = (id) => {
    this.props.onClick(id, this.props.note, this.props.targetEntity);
  };

  render() {
    const { note, withMessage, message, preview, targetEntity, ...rest } = this.props;
    let iconNode = <i className="note-icon note-add-note" />;
    let msg = null;

    if (withMessage) {
      msg = message || I18n.t('NOTE_BUTTON.DEFAULT_MESSAGE');
    }

    if (note) {
      iconNode = note.pinned
        ? <i className="note-icon note-pinned-note" />
        : <i className="note-icon note-with-text" />;
    }

    return (
      <PopoverButton {...rest} onClick={this.handleClick}>
        {iconNode} {preview && msg}
      </PopoverButton>
    );
  }
}

export default NoteButton;
