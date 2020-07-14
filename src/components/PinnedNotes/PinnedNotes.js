import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { entitiesPrefixes } from 'constants/uuid';
import EventEmitter, { PROFILE_RELOAD, NOTE_ADDED, NOTE_UPDATED, NOTE_REMOVED } from 'utils/EventEmitter';
import NotePopover from 'components/NotePopover';
import ShortLoader from 'components/ShortLoader';
import Uuid from 'components/Uuid';
import PinnedNotesQuery from './graphql/PinnedNotesQuery';
import './PinnedNotes.scss';

class PinnedNotes extends PureComponent {
  static propTypes = {
    targetType: PropTypes.string.isRequired,
    notes: PropTypes.query(PropTypes.pageable(PropTypes.noteEntity)).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.on(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.on(NOTE_UPDATED, this.onNoteEvent);
    EventEmitter.on(NOTE_REMOVED, this.onNoteEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.off(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.off(NOTE_UPDATED, this.onNoteEvent);
    EventEmitter.off(NOTE_REMOVED, this.onNoteEvent);
  }

  onProfileEvent = () => {
    this.props.notes.refetch();
  };

  /**
   * Refetch list of notes only if targetType is equal
   *
   * @param targetType
   */
  onNoteEvent = ({ targetType }) => {
    if (targetType === this.props.targetType) {
      this.props.notes.refetch();
    }
  };

  renderItem = (item) => {
    const {
      noteId,
      subject,
      content,
      operator,
      changedAt,
      changedBy,
      playerUUID,
      targetUUID,
      targetType,
    } = item || {};

    const changedAtLabel = changedAt
      ? moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm:ss')
      : I18n.t('COMMON.UNKNOWN_TIME');

    return (
      <NotePopover
        key={noteId}
        playerUUID={playerUUID}
        targetUUID={targetUUID}
        targetType={targetType}
        note={item}
        placement="bottom-start"
        hideArrow
      >
        <div className="PinnedNotes__item">
          <If condition={changedBy}>
            <b className="PinnedNotes__item-operator">{operator.fullName}</b>
            <div className="PinnedNotes__item-author">
              {I18n.t('COMMON.AUTHOR_BY')}
              <Uuid uuid={changedBy} uuidPrefix="OP" />
            </div>
          </If>

          <small>
            {changedAtLabel} {I18n.t('COMMON.TO')} {this.renderItemId(targetUUID)}
          </small>

          <div className="PinnedNotes__item-subject">{subject}</div>
          <div className="PinnedNotes__item-content">{content}</div>
        </div>
      </NotePopover>
    );
  };

  renderItemId = (targetUUID) => {
    const [targetType] = targetUUID.split('-', 1);

    return <Uuid uuid={targetUUID} uuidPrefix={entitiesPrefixes[targetType]} />;
  };

  render() {
    const {
      notes: {
        loading,
        data,
      },
    } = this.props;

    const notes = get(data, 'notes.content') || [];

    return (
      <div className="PinnedNotes">
        <div className="PinnedNotes__title">
          {I18n.t('PINNED_NOTES.TITLE')}
        </div>
        <div className="PinnedNotes__content">
          <Choose>
            <When condition={!notes && loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              {notes.map(this.renderItem)}
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default withRequests({
  notes: PinnedNotesQuery,
})(PinnedNotes);
