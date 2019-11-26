import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { omit } from 'lodash';
import PropTypes from '../../constants/propTypes';
import PopoverButton from '../PopoverButton';
import NoteIcon from '../NoteIcon';
import './NoteButton.scss';

class NoteButton extends PureComponent {
  static contextTypes = {
    notes: PropTypes.shape({
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
    }),
  };

  static propTypes = {
    id: PropTypes.string,
    targetUUID: PropTypes.string,
    playerUUID: PropTypes.string.isRequired,
    targetType: PropTypes.string,
    note: PropTypes.noteEntity,
    className: PropTypes.string,
    preview: PropTypes.bool,
    withMessage: PropTypes.bool,
    message: PropTypes.string,
    placement: PropTypes.string,
    manual: PropTypes.bool,
    onAddSuccess: PropTypes.func,
    onUpdateSuccess: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
  };

  static defaultProps = {
    id: null,
    targetUUID: null,
    targetType: '',
    className: 'cursor-pointer',
    message: null,
    note: null,
    preview: false,
    withMessage: false,
    placement: 'left',
    manual: false,
    onAddSuccess: () => {},
    onUpdateSuccess: () => {},
    onDeleteSuccess: () => {},
  };

  state = {
    note: this.props.note,
  };

  static getDerivedStateFromProps(props) {
    if (!props.manual) {
      return { note: props.note };
    }

    return null;
  }

  onAddSuccess = (note) => {
    this.setState({ note });

    this.props.onAddSuccess(note);
  };

  onUpdateSuccess = (note) => {
    this.setState({ note });

    this.props.onUpdateSuccess(note);
  };

  onDeleteSuccess = (note) => {
    this.setState({ note: null });

    this.props.onDeleteSuccess(note);
  };

  /**
   * Get note by refs
   * @return {*}
   */
  getNote = () => this.state.note;

  handleClick = (id) => {
    const { notes: { onEditNoteClick, onAddNoteClick } } = this.context;
    const {
      manual,
      placement,
      targetUUID,
      playerUUID,
      targetType,
    } = this.props;
    const { note } = this.state;

    const params = {
      manual,
      placement,
      onAddSuccess: this.onAddSuccess,
      onUpdateSuccess: this.onUpdateSuccess,
      onDeleteSuccess: this.onDeleteSuccess,
    };

    if (note) {
      onEditNoteClick(id, note, params);
    } else {
      onAddNoteClick(id, targetUUID, playerUUID, targetType, params);
    }
  };

  render() {
    const {
      id,
      withMessage,
      message,
      preview,
      className,
      targetUUID,
      playerUUID,
      ...rest
    } = this.props;
    const { note } = this.state;

    const compiledClassName = classNames(className, { 'note-preview': preview && !!note });
    const buttonProps = omit(rest, [
      'manual',
      'note',
      'targetType',
      'onAddSuccess',
      'onUpdateSuccess',
      'onDeleteSuccess',
    ]);
    let msg = null;

    if (withMessage) {
      msg = message || I18n.t('NOTE_BUTTON.DEFAULT_MESSAGE');
    }

    return (
      <PopoverButton
        id={id || `note-button-${playerUUID}-${targetUUID}`}
        onClick={this.handleClick}
        className={compiledClassName}
        {...buttonProps}
      >
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
