import React from 'react';
import { EditNote, ManualNote, Placement } from 'types/Note';
import NotePopover from '../../NotePopover';
import NoteIcon from '../../NoteIcon';
import useNoteActionManual from '../hooks/useNoteActionManual';

type Props = {
  playerUUID: string,
  targetUUID: string,
  targetType: string,
  note?: ManualNote,
  placement?: Placement,
  onEditSuccess: (values: EditNote) => void,
  onDeleteSuccess: () => void,
};

const NoteActionManual = (props: Props) => {
  const {
    note,
    placement,
    onEditSuccess,
    onDeleteSuccess,
    playerUUID,
    targetUUID,
    targetType,
  } = props;

  const {
    isOpen,
    isDirty,
    targetId,
    handleSetDirty,
    handleOpen,
    handleClose,
    handleRemoveNote,
    handleSubmit,
  } = useNoteActionManual({
    onEditSuccess,
    onDeleteSuccess,
    playerUUID,
    targetUUID,
    targetType,
  });

  return (
    <>
      <NoteIcon note={note} targetId={targetId} onClick={handleOpen} />

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

export default React.memo(NoteActionManual);
