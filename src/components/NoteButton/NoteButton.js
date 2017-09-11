import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import PopoverButton from '../PopoverButton';
import './NoteButton.scss';

class NoteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    targetEntity: PropTypes.object,
    note: PropTypes.noteEntity,
    preview: PropTypes.bool,
    withMessage: PropTypes.bool,
    message: PropTypes.string,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    className: 'cursor-pointer',
    message: null,
    note: null,
    targetEntity: null,
    preview: false,
    withMessage: false,
    onClick: null,
  };

  handleClick = (id) => {
    this.props.onClick(id, this.props.note, this.props.targetEntity);
  };

  render() {
    const { note, withMessage, message, preview, targetEntity, className, ...rest } = this.props;
    const compiledClassName = classNames(className, { 'note-preview': preview && !!note });
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
      <PopoverButton {...rest} onClick={this.handleClick} className={compiledClassName}>
        {iconNode} {preview && note && note.content} {preview && !note && msg}
      </PopoverButton>
    );
  }
}

export default NoteButton;
