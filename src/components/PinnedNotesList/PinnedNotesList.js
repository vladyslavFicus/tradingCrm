import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { entities, entitiesPrefixes } from 'constants/uuid';
import NotePopover from 'components/NotePopover';
import ShortLoader from 'components/ShortLoader';
import Uuid from 'components/Uuid';
import EventEmitter, { PROFILE_RELOAD, NOTE_ADDED, NOTE_UPDATED, NOTE_REMOVED } from 'utils/EventEmitter';
import PinnedNotesQuery from './graphql/PinnedNotesQuery';

class PinnedNotesList extends PureComponent {
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

  renderItem = item => (
    <NotePopover
      key={item.noteId}
      playerUUID={item.playerUUID}
      targetUUID={item.targetUUID}
      targetType={item.targetType}
      note={item}
      placement="bottom-start"
      className="notes-button__popover"
      hideArrow
    >
      <div className="d-block mb-2 note-content">
        <If condition={item.changedBy}>
          <If condition={item.operator}>
            <b>{item.operator.fullName}</b>
          </If>
          <If condition={!item.operator}>
            <div>&mdash;</div>
          </If>
          <div className="note-content__author">
            {I18n.t('COMMON.AUTHOR_BY')}
            <Uuid uuid={item.changedBy} uuidPrefix={entitiesPrefixes[entities.operator]} />
          </div>
        </If>
        <small>
          {
            item.changedAt
              ? moment.utc(item.changedAt).local().format('DD.MM.YYYY HH:mm:ss')
              : I18n.t('COMMON.UNKNOWN_TIME')
          } {I18n.t('COMMON.TO')} {this.renderItemId(item.targetUUID)}
        </small>
        <div className="note-content__subject">{item.subject}</div>
        <div className="note-content__body">{item.content}</div>
      </div>
    </NotePopover>
  );

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

    const notes = get(data, 'notes.content');

    return (
      <div className="account-details__pinned-notes">
        <span className="account-details__label">
          {I18n.t('PLAYER_PROFILE.PINNED_NOTES.TITLE')}
        </span>
        <div className="card">
          <div className="card-body">
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
      </div>
    );
  }
}

export default withRequests({
  notes: PinnedNotesQuery,
})(PinnedNotesList);
