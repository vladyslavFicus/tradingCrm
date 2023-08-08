import { useCallback, useEffect } from 'react';
import { Utils } from '@crm/common';
import { Note } from '__generated__/types';
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
    Utils.EventEmitter.on(Utils.CLIENT_RELOAD, handleRefetchNotes);
    Utils.EventEmitter.on(Utils.NOTE_RELOAD, handleNoteReload);

    return () => {
      Utils.EventEmitter.off(Utils.CLIENT_RELOAD, handleRefetchNotes);
      Utils.EventEmitter.off(Utils.NOTE_RELOAD, handleNoteReload);
    };
  }, []);

  return { loading, notes };
};

export default usePinnedNotes;
