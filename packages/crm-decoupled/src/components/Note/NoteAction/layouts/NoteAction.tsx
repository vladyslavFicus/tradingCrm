import React, { useCallback } from 'react';
import { NoteEntity, Placement } from 'types/Note';
import NotePopover from '../../NotePopover';
import NoteIcon from '../../NoteIcon';
import useNoteAction from '../hooks/useNoteAction';

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

  const {
    isOpen,
    isDirty,
    targetId,
    handleOpen,
    handleClose,
    handleRemoveNote,
    handleSetDirty,
    handleSubmit,
  } = useNoteAction({
    note,
    playerUUID,
    targetUUID,
    targetType,
    onRefetch,
  });

  // ===== Renders ===== //
  const renderTrigger = useCallback(() => {
    if (children) {
      return React.cloneElement(children, { id: targetId, onClick: handleOpen });
    }

    return <NoteIcon note={note} targetId={targetId} onClick={handleOpen} />;
  }, [note, children, targetId, handleOpen]);

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
