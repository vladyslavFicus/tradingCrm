import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import NotePopover from 'components/NotePopover';
import NoteIcon from 'components/NoteIcon';
import './NoteButton.scss';

class NoteButton extends PureComponent {
  static propTypes = {
    playerUUID: PropTypes.string.isRequired,
    targetUUID: PropTypes.string,
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
    targetUUID: null,
    targetType: null,
    className: null,
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

  render() {
    const {
      manual,
      placement,
      withMessage,
      message,
      preview,
      className,
      targetUUID,
      targetType,
      playerUUID,
    } = this.props;
    const { note } = this.state;

    const compiledClassName = classNames(className, { 'note-preview': preview && !!note });

    let msg = null;

    if (withMessage) {
      msg = message || I18n.t('NOTE_BUTTON.DEFAULT_MESSAGE');
    }

    return (
      <NotePopover
        note={note}
        manual={manual}
        placement={placement}
        playerUUID={playerUUID}
        targetUUID={targetUUID}
        targetType={targetType}
        onAddSuccess={this.onAddSuccess}
        onUpdateSuccess={this.onUpdateSuccess}
        onDeleteSuccess={this.onDeleteSuccess}
      >
        <span className={compiledClassName}>
          <Choose>
            <When condition={note}>
              <NoteIcon type={`${note.pinned ? 'pinned' : 'filled'}`} className="note-preview__icon" />
            </When>
            <Otherwise>
              <NoteIcon type="new" />
            </Otherwise>
          </Choose>
          {preview && note && note.content} {preview && !note && msg}
        </span>
      </NotePopover>
    );
  }
}

export default NoteButton;
