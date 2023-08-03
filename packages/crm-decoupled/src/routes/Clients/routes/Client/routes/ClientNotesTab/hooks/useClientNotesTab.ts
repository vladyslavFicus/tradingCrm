import { useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import EventEmitter, { CLIENT_RELOAD, NOTE_RELOAD } from 'utils/EventEmitter';
import { targetTypes } from 'constants/note';
import { useClientNotesQuery, ClientNotesQueryVariables } from '../graphql/__generated__/ClientNotesQuery';

const useClientNotesTab = () => {
  const targetUUID = useParams().id as string;

  const state = useLocation().state as State<ClientNotesQueryVariables>;

  // ===== Requests ===== //
  const { data, loading, variables = {}, refetch, fetchMore } = useClientNotesQuery({
    variables: {
      ...state?.filters as ClientNotesQueryVariables,
      targetUUID,
      size: 20,
      page: 0,
    },
  });

  const { content = [], last = true, number = 0 } = data?.notes || {};

  // ===== Handlers ===== //
  const handleLoadMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as ClientNotesQueryVariables), 'page', number + 1),
      });
    }
  }, [fetchMore, loading, number, variables]);

  // Refetch list of notes only if targetType is PLAYER
  const handleNoteReload = useCallback(({ targetType }: { targetType: string }) => {
    if (targetType === targetTypes.PLAYER) {
      refetch();
    }
  }, [refetch]);

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);
    EventEmitter.on(NOTE_RELOAD, handleNoteReload);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
      EventEmitter.off(NOTE_RELOAD, handleNoteReload);
    };
  }, []);

  return {
    refetch,
    last,
    content,
    loading,
    handleLoadMore,
  };
};

export default useClientNotesTab;
