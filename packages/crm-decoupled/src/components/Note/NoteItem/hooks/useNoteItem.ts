import { useCallback } from 'react';
import { Utils, useModal } from '@crm/common';
import { Note } from 'types/Note';
import { UpdateNoteModalProps } from 'modals/UpdateNoteModal';
import UpdateNoteModal from 'modals/UpdateNoteModal/UpdateNoteModal';
import { useRemoveNoteMutation } from '../../NoteAction/graphql/__generated__/RemoveNoteMutation';

type Props = {
  note: Note,
};

const useNoteItem = (props: Props) => {
  const { note } = props;

  // ===== Modals ===== //
  const updateNoteModal = useModal<UpdateNoteModalProps>(UpdateNoteModal);

  // ===== Requests ===== //
  const [removeNoteMutation] = useRemoveNoteMutation();

  // ===== Handlers ===== //
  const handleEditNote = useCallback(() => {
    updateNoteModal.show({ note });
  }, [updateNoteModal, note]);

  const handleRemoveNote = useCallback(async () => {
    try {
      await removeNoteMutation({ variables: { noteId: note.noteId } });

      Utils.EventEmitter.emit(Utils.NOTE_RELOAD, { targetType: note.targetType });
    } catch (e) {
      // Do nothing...
    }
  }, [note]);

  return {
    handleEditNote,
    handleRemoveNote,
  };
};

export default useNoteItem;
