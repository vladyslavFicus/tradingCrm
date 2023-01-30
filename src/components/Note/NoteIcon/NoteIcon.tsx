import React from 'react';
import { NoteEntity, ManualNote } from 'types/Note';
import './NoteIcon.scss';

type Props = {
  targetId: string,
  note?: NoteEntity | ManualNote,
  onClick: (e: React.MouseEvent) => void,
};

const NoteIcon = (props: Props) => {
  const { note, targetId, onClick } = props;

  let type = 'new';

  if (note) {
    type = note.pinned ? 'pinned' : 'filled';
  }

  return (
    <i id={targetId} onClick={onClick} className={`note-icon note-icon-${type}`} />
  );
};

export default React.memo(NoteIcon);
