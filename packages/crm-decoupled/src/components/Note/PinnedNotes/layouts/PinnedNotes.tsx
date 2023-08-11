import React, { useCallback } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Types, Constants } from '@crm/common';
import ShortLoader from 'components/ShortLoader';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import usePinnedNotes from '../hooks/usePinnedNotes';
import './PinnedNotes.scss';

type Props = {
  targetUUID: string,
  targetType: string,
};

const PinnedNotes = (props: Props) => {
  const { targetType, targetUUID } = props;

  const { loading, notes } = usePinnedNotes({ targetType, targetUUID });

  // ===== Renders ===== //
  const renderItemId = useCallback((noteTargetUUID: string) => {
    const [type] = noteTargetUUID.split('-', 1);
    const uuidPrefix = Constants.entitiesPrefixes[type as Constants.entities];

    return (
      <Uuid key={noteTargetUUID} uuid={noteTargetUUID} uuidPrefix={uuidPrefix} />
    );
  }, []);

  const renderChangedBy = useCallback((item: Types.Note) => {
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
  }, []);

  const renderItem = useCallback((item: Types.Note) => {
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
  }, [renderChangedBy, renderItemId]);

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
