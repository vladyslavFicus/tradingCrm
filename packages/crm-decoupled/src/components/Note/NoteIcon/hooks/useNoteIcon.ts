import { Types } from '@crm/common';

type Props = {
  note?: Types.NoteEntity | Types.ManualNote,
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
