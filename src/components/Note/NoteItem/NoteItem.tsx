import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal } from 'types';
import permissions from 'config/permissions';
import EventEmitter, { NOTE_RELOAD } from 'utils/EventEmitter';
import Uuid from 'components/Uuid';
import { entities, entitiesPrefixes } from 'constants/uuid';
import UpdateNoteModal from 'modals/UpdateNoteModal';
import { Note } from 'types/Note';
import ActionsDropDown from '../../ActionsDropDown';
import { useRemoveNoteMutation } from '../NoteAction/graphql/__generated__/RemoveNoteMutation';
import './NoteItem.scss';

type Props = {
  note: Note,
  modals: {
    updateNoteModal: Modal,
  },
};

const NoteItem = (props: Props) => {
  const { note, modals } = props;

  // ===== Requests ===== //
  const [removeNoteMutation] = useRemoveNoteMutation();

  // ===== Handlers ===== //
  const handleEditNote = () => {
    modals.updateNoteModal.show({ note });
  };

  const handleRemoveNote = async () => {
    try {
      await removeNoteMutation({ variables: { noteId: note.noteId } });

      EventEmitter.emit(NOTE_RELOAD, { targetType: note.targetType });
    } catch (e) {
      // Do nothing...
    }
  };

  // ===== Renders ===== //
  const renderItemId = (noteTargetUUID: string) => {
    const [type] = noteTargetUUID.split('-', 1);
    const uuidPrefix = entitiesPrefixes[type as entities];

    return (
      <Uuid uuid={noteTargetUUID} uuidPrefix={uuidPrefix} />
    );
  };

  const {
    changedAt,
    changedBy,
    targetUUID,
    pinned,
    subject,
    content,
    operator,
  } = note;

  return (
    <div className="NoteItem">
      <div className="NoteItem__content-wrapper">
        <Choose>
          <When condition={!!operator?.fullName}>
            <b>{operator?.fullName}</b>
          </When>

          <Otherwise>
            &mdash;
          </Otherwise>
        </Choose>

        <div className="NoteItem__heading">
          <If condition={!!changedBy}>
            <Uuid uuid={changedBy} uuidPrefix={entitiesPrefixes[entities.OPERATOR]} />
          </If>

          <div className="NoteItem__edition-date">
            <Choose>
              <When condition={!!changedAt}>
                {moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm:ss')}
              </When>

              <Otherwise>
                {I18n.t('COMMON.UNKNOWN_TIME')}
              </Otherwise>
            </Choose>

            {' '} {I18n.t('COMMON.TO')} {renderItemId(targetUUID)}
          </div>
        </div>

        <div className="NoteItem__body-container">
          <div className="NoteItem__body">
            <If condition={!!subject}>
              <div className="NoteItem__subject">{subject}</div>
            </If>

            <div className="NoteItem__content">{content}</div>

            <If condition={pinned}>
              <span className="NoteItem__pinned-note-badge">
                {I18n.t('COMMON.PINNED')}
              </span>
            </If>
          </div>

          <ActionsDropDown
            items={[
              {
                label: I18n.t('COMMON.ACTIONS.EDIT'),
                onClick: handleEditNote,
                permission: permissions.NOTES.UPDATE_NOTE,
              },
              {
                label: I18n.t('COMMON.ACTIONS.DELETE'),
                onClick: handleRemoveNote,
                permission: permissions.NOTES.DELETE_NOTE,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    updateNoteModal: UpdateNoteModal,
  }),
)(NoteItem);
