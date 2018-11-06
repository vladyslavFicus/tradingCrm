import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import PopoverButton from '../PopoverButton';
import NoteIcon from '../NoteIcon';
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
    onClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: 'cursor-pointer',
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
    const { note, withMessage, message, preview, targetEntity, className, ...rest } = this.props;
    const compiledClassName = classNames(className, { 'note-preview': preview && !!note });
    let msg = null;

    if (withMessage) {
      msg = message || I18n.t('NOTE_BUTTON.DEFAULT_MESSAGE');
    }

    return (
      <PopoverButton {...rest} onClick={this.handleClick} className={compiledClassName}>
        <Choose>
          <When condition={note}>
            <NoteIcon type={`${note.pinned ? 'pinned' : 'filled'}`} className="note-preview__icon" />
          </When>
          <Otherwise>
            <NoteIcon type="new" />
          </Otherwise>
        </Choose>
        {preview && note && note.content} {preview && !note && msg}
      </PopoverButton>
    );
  }
}

export default NoteButton;
