import React, { useEffect } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { entitiesPrefixes, entities } from 'constants/uuid';
import EventEmitter, { CLIENT_RELOAD, NOTE_RELOAD } from 'utils/EventEmitter';
import ShortLoader from 'components/ShortLoader';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import { Note } from 'types/Note';
import { usePinnedNotesQuery } from './graphql/__generated__/PinnedNotesQuery';
import './PinnedNotes.scss';

type Props = {
  targetUUID: string,
  targetType: string,
};

const PinnedNotes = (props: Props) => {
  const { targetType, targetUUID } = props;

  // ===== Requests ===== //
  const pinnedNotesQuery = usePinnedNotesQuery({
    variables: { size: 100, pinned: true, targetUUID },
    fetchPolicy: 'cache-and-network',
  });

  const { data, loading } = pinnedNotesQuery;
  const notes = data?.notes.content as Array<Note> || [];

  // ===== Handlers ===== //
  const handleRefetchNotes = () => {
    pinnedNotesQuery.refetch();
  };

  /**
   * Refetch list of notes only if targetType is equal
   *
   * @param targetType
   */
  const handleNoteReload = (reloadData: { targetType: string}) => {
    if (targetType === reloadData.targetType) {
      handleRefetchNotes();
    }
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, handleRefetchNotes);
    EventEmitter.on(NOTE_RELOAD, handleNoteReload);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, handleRefetchNotes);
      EventEmitter.off(NOTE_RELOAD, handleNoteReload);
    };
  }, []);

  // ===== Renders ===== //
  const renderItemId = (noteTargetUUID: string) => {
    const [type] = noteTargetUUID.split('-', 1);
    const uuidPrefix = entitiesPrefixes[type as entities];

    return (
      <Uuid key={noteTargetUUID} uuid={noteTargetUUID} uuidPrefix={uuidPrefix} />
    );
  };

  const renderChangedBy = (item: Note) => {
    if (!item.changedBy) {
      return null;
    }

    return (
      <>
        <Choose>
          <When condition={!!item.operator?.fullName}>
            <b className="PinnedNotes__item-operator">{item.operator?.fullName}</b>
          </When>

          <Otherwise>
            &mdash;
          </Otherwise>
        </Choose>

        <div className="PinnedNotes__item-author">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={item.changedBy} uuidPrefix="OP" />
        </div>
      </>
    );
  };

  const renderItem = (item: Note) => {
    const {
      subject,
      content,
      changedAt,
      playerUUID,
      targetUUID: noteTargetUUID,
      targetType: noteTargetType,
    } = item;

    const changedAtLabel = changedAt
      ? moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm:ss')
      : I18n.t('COMMON.UNKNOWN_TIME');

    return (
      <div key={item.noteId}>
        <NoteAction
          note={item}
          playerUUID={playerUUID}
          targetUUID={noteTargetUUID}
          targetType={noteTargetType}
        >
          <div className="PinnedNotes__item">
            {renderChangedBy(item)}

            <span className="PinnedNotes__item-time">
              {changedAtLabel} {I18n.t('COMMON.TO')} {renderItemId(targetUUID)}
            </span>

            <div className="PinnedNotes__item-subject">{subject}</div>
            <div className="PinnedNotes__item-content">{content}</div>
          </div>
        </NoteAction>
      </div>
    );
  };

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
            {notes.map(renderItem)}
          </Otherwise>
        </Choose>
      </div>
    </div>
  );
};

export default React.memo(PinnedNotes);
