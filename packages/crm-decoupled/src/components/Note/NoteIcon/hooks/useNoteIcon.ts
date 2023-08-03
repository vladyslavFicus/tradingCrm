import { ManualNote, NoteEntity } from 'types/Note';

type Props = {
  note?: NoteEntity | ManualNote,
};

const useNoteIcon = (props: Props) => {
  const { note } = props;

  let type = 'new';

  if (note) {
    type = note.pinned ? 'pinned' : 'filled';
  }

  return { type };
};

export default useNoteIcon;
