import { useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Utils } from '@crm/common';
import { State } from 'types';
import { targetTypes } from 'constants/note';
import { useLeadNotesQuery, LeadNotesQueryVariables } from '../graphql/__generated__/LeadNotesQuery';

const useLeadNotesTab = () => {
  const targetUUID = useParams().id as string;

  const state = useLocation().state as State<LeadNotesQueryVariables>;

  // ===== Requests ===== //
  const { data, loading, variables = {}, refetch, fetchMore } = useLeadNotesQuery({
    variables: {
      ...state?.filters as LeadNotesQueryVariables,
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
        variables: set(cloneDeep(variables as LeadNotesQueryVariables), 'page', number + 1),
      });
    }
  }, [loading, variables, number]);

  // Refetch list of notes only if targetType is LEAD
  const handleNoteReload = useCallback(({ targetType }: { targetType: string }) => {
    if (targetType === targetTypes.LEAD) {
      refetch();
    }
  }, []);

  // ===== Effects ===== //
  useEffect(() => {
    Utils.EventEmitter.on(Utils.NOTE_RELOAD, handleNoteReload);

    return () => {
      Utils.EventEmitter.off(Utils.NOTE_RELOAD, handleNoteReload);
    };
  }, []);

  return {
    content,
    loading,
    last,
    refetch,
    handleLoadMore,
  };
};

export default useLeadNotesTab;
