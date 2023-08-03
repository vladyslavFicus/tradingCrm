import React, { useCallback, useState } from 'react';
import { v4 } from 'uuid';
import { debounce } from 'lodash';
import { FormValues, NoteEntity } from 'types/Note';
import EventEmitter, { NOTE_RELOAD } from 'utils/EventEmitter';
import { useAddNoteMutation } from '../graphql/__generated__/AddNoteMutation';
import { useUpdateNoteMutation } from '../graphql/__generated__/UpdateNoteMutation';
import { useRemoveNoteMutation } from '../graphql/__generated__/RemoveNoteMutation';

type Props = {
  playerUUID: string,
  targetUUID: string,
  targetType: string,
  note?: NoteEntity,
  onRefetch?: () => void,
};

const useNoteAction = (props: Props) => {
  const {
    note,
    playerUUID,
    targetUUID,
    targetType,
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

  const handleClose = useCallback((ignoreChanges = false) => {
    if (ignoreChanges || !isDirty) {
      setIsOpen(false);
    }
  }, [isDirty]);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setIsOpen(true);
  }, []);

  const handleRefetch = useCallback(() => {
    if (onRefetch) {
      onRefetch();
    }
  }, [onRefetch]);

  const handleAddNote = useCallback(async (formValues: FormValues) => {
    const variables = { ...formValues, targetUUID, playerUUID, targetType };

    try {
      await addNoteMutation({ variables });

      EventEmitter.emit(NOTE_RELOAD, { targetType });

      handleClose(true);
      handleRefetch();
    } catch (e) {
      // Do nothing...
    }
  }, [targetUUID, playerUUID, targetType]);

  const handleUpdateNote = useCallback(async (formValues: FormValues, noteId: string) => {
    const variables = { ...formValues, noteId };

    try {
      await updateNoteMutation({ variables });

      EventEmitter.emit(NOTE_RELOAD, { targetType });

      handleClose(true);
      handleRefetch();
    } catch (e) {
      // Do nothing...
    }
  }, [targetType, handleClose, handleRefetch]);

  const handleRemoveNote = useCallback(async () => {
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
  }, [note, targetType, handleClose, handleRefetch]);

  const handleSubmit = useCallback(async (data: FormValues) => {
    if (note) {
      await handleUpdateNote(data, note.noteId);
    } else {
      await handleAddNote(data);
    }
  }, [note]);

  return {
    isOpen,
    isDirty,
    targetId,
    handleOpen,
    handleClose,
    handleRemoveNote,
    handleSetDirty,
    handleSubmit,
  };
};

export default useNoteAction;
