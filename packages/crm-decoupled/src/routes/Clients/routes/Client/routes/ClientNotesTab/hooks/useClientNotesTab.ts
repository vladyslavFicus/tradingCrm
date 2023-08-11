import { useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Utils, Types, Constants } from '@crm/common';
import { useClientNotesQuery, ClientNotesQueryVariables } from '../graphql/__generated__/ClientNotesQuery';

const useClientNotesTab = () => {
  const targetUUID = useParams().id as string;

  const state = useLocation().state as Types.State<ClientNotesQueryVariables>;

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
    if (targetType === Constants.targetTypes.PLAYER) {
      refetch();
    }
  }, [refetch]);

  // ===== Effects ===== //
  useEffect(() => {
    Utils.EventEmitter.on(Utils.CLIENT_RELOAD, refetch);
    Utils.EventEmitter.on(Utils.NOTE_RELOAD, handleNoteReload);

    return () => {
      Utils.EventEmitter.off(Utils.CLIENT_RELOAD, refetch);
      Utils.EventEmitter.off(Utils.NOTE_RELOAD, handleNoteReload);
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
