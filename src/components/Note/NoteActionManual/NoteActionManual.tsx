import React, { useState } from 'react';
import { v4 } from 'uuid';
import { debounce } from 'lodash';
import { ManualNote, EditNote, FormValues, Placement } from 'types/Note';
import NotePopover from '../NotePopover';
import NoteIcon from '../NoteIcon';

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

  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [targetId] = useState(`note-${v4()}`);

  // ===== Handlers ===== //
  const handleSetDirty = debounce((dirty: boolean) => setIsDirty(dirty), 100);

  const handleClose = (ignoreChanges = false) => {
    if (ignoreChanges || !isDirty) {
      setIsOpen(false);
    }
  };

  const handleOpen = (e: React.MouseEvent | undefined) => {
    if (e) {
      e.stopPropagation();
    }

    setIsOpen(true);
  };

  const handleRemoveNote = () => {
    onDeleteSuccess();
    handleClose(true);
  };

  const handleSubmit = (formValues: FormValues) => {
    const variables = { ...formValues, targetUUID, playerUUID, targetType };

    onEditSuccess(variables);
    handleClose(true);
  };

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
