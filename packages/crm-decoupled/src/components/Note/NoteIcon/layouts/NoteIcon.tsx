import React from 'react';
import { ManualNote, NoteEntity } from 'types/Note';
import useNoteIcon from '../hooks/useNoteIcon';
import './NoteIcon.scss';

type Props = {
  targetId: string,
  note?: NoteEntity | ManualNote,
  onClick: (e: React.MouseEvent) => void,
};

const NoteIcon = (props: Props) => {
  const { note, targetId, onClick } = props;

  const { type } = useNoteIcon({ note });

  return (
    <i id={targetId} onClick={onClick} className={`note-icon note-icon-${type}`} />
  );
};

export default React.memo(NoteIcon);
