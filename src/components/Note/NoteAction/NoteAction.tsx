import React, { useState } from 'react';
import { v4 } from 'uuid';
import { debounce } from 'lodash';
import EventEmitter, { NOTE_RELOAD } from 'utils/EventEmitter';
import { FormValues, NoteEntity, Placement } from 'types/Note';
import NotePopover from '../NotePopover';
import NoteIcon from '../NoteIcon';
import { useAddNoteMutation } from './graphql/__generated__/AddNoteMutation';
import { useUpdateNoteMutation } from './graphql/__generated__/UpdateNoteMutation';
import { useRemoveNoteMutation } from './graphql/__generated__/RemoveNoteMutation';

type Props = {
  playerUUID: string,
  targetUUID: string,
  targetType: string,
  note?: NoteEntity,
  placement?: Placement,
  children?: React.ReactElement,
  onRefetch?: () => void,
};

const NoteAction = (props: Props) => {
  const {
    note,
    placement,
    playerUUID,
    targetUUID,
    targetType,
    children,
    onRefetch,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [targetId] = useState(`note-${v4()}`);

  // ===== Requests ===== //
  const [addNoteMutation] = useAddNoteMutation();
  const [updateNoteMutation] = useUpdateNoteMutation();
  const [removeNoteMutation] = useRemoveNoteMutation();

  // ===== Handlers ===== //
  const handleSetDirty = debounce((dirty: boolean) => setIsDirty(dirty), 100);

  const handleClose = (ignoreChanges = false) => {
    if (ignoreChanges || !isDirty) {
      setIsOpen(false);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setIsOpen(true);
  };

  const handleRefetch = () => {
    if (onRefetch) {
      onRefetch();
    }
  };

  const handleAddNote = async (formValues: FormValues) => {
    const variables = { ...formValues, targetUUID, playerUUID, targetType };

    try {
      await addNoteMutation({ variables });

      EventEmitter.emit(NOTE_RELOAD, { targetType });

      handleClose(true);
      handleRefetch();
    } catch (e) {
      // Do nothing...
    }
  };

  const handleUpdateNote = async (formValues: FormValues, noteId: string) => {
    const variables = { ...formValues, noteId };

    try {
      await updateNoteMutation({ variables });

      EventEmitter.emit(NOTE_RELOAD, { targetType });

      handleClose(true);
      handleRefetch();
    } catch (e) {
      // Do nothing...
    }
  };

  const handleRemoveNote = async () => {
    if (note) {
      try {
        await removeNoteMutation({ variables: { noteId: note.noteId } });

        EventEmitter.emit(NOTE_RELOAD, { targetType });

        handleClose(true);
        handleRefetch();
      } catch (e) {
        // Do nothing...
      }
    }
  };

  const handleSubmit = async (data: FormValues) => {
    if (note) {
      await handleUpdateNote(data, note.noteId);
    } else {
      await handleAddNote(data);
    }
  };

  // ===== Renders ===== //
  const renderTrigger = () => {
    if (children) {
      return React.cloneElement(children, { id: targetId, onClick: handleOpen });
    }

    return <NoteIcon note={note} targetId={targetId} onClick={handleOpen} />;
  };

  return (
    <>
      {renderTrigger()}

      <NotePopover
        note={note}
        placement={placement}
        targetId={targetId}
        isOpen={isOpen}
        isDirty={isDirty}
        onSubmit={handleSubmit}
        onClose={handleClose}
        onRemoveNote={handleRemoveNote}
        onSetDirty={handleSetDirty}
      />
    </>
  );
};

export default React.memo(NoteAction);
