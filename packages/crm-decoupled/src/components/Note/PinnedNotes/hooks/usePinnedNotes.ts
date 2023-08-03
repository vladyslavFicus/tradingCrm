import { useCallback, useEffect } from 'react';
import { Note } from '__generated__/types';
import EventEmitter, { CLIENT_RELOAD, NOTE_RELOAD } from 'utils/EventEmitter';
import { usePinnedNotesQuery } from '../graphql/__generated__/PinnedNotesQuery';

type Props = {
  targetUUID: string,
  targetType: string,
};

const usePinnedNotes = (props: Props) => {
  const { targetType, targetUUID } = props;

  // ===== Requests ===== //
  const pinnedNotesQuery = usePinnedNotesQuery({
    variables: { size: 100, pinned: true, targetUUID },
    fetchPolicy: 'cache-and-network',
  });

  const { data, loading } = pinnedNotesQuery;
  const notes = data?.notes.content as Array<Note> || [];

  // ===== Handlers ===== //
  const handleRefetchNotes = useCallback(() => {
    pinnedNotesQuery.refetch();
  }, []);

  /**
   * Refetch list of notes only if targetType is equal
   *
   * @param targetType
   */
  const handleNoteReload = useCallback((reloadData: { targetType: string }) => {
    if (targetType === reloadData.targetType) {
      handleRefetchNotes();
    }
  }, [targetType, handleRefetchNotes]);

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, handleRefetchNotes);
    EventEmitter.on(NOTE_RELOAD, handleNoteReload);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, handleRefetchNotes);
      EventEmitter.off(NOTE_RELOAD, handleNoteReload);
    };
  }, []);

  return { loading, notes };
};

export default usePinnedNotes;
