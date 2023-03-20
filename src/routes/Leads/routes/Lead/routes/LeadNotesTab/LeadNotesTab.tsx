import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { Note } from '__generated__/types';
import { targetTypes } from 'constants/note';
import EventEmitter, { NOTE_RELOAD } from 'utils/EventEmitter';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/Note/NoteItem';
import LeadNotesFilter from './components/LeadNotesFilter';
import { useLeadNotesQuery, LeadNotesQueryVariables } from './graphql/__generated__/LeadNotesQuery';
import './LeadNotesTab.scss';

const LeadNotesTab = () => {
  const { id: targetUUID } = useParams<{ id: string }>();

  const { state } = useLocation<State<LeadNotesQueryVariables>>();

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
  const handleLoadMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as LeadNotesQueryVariables), 'page', number + 1),
      });
    }
  };

  // Refetch list of notes only if targetType is LEAD
  const handleNoteReload = ({ targetType }: { targetType: string }) => {
    if (targetType === targetTypes.LEAD) {
      refetch();
    }
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(NOTE_RELOAD, handleNoteReload);

    return () => {
      EventEmitter.off(NOTE_RELOAD, handleNoteReload);
    };
  }, []);

  return (
    <div className="LeadNotesTab">
      <TabHeader title={I18n.t('LEAD_PROFILE.NOTES.TITLE')} />

      <LeadNotesFilter onRefetch={refetch} />

      <div className="LeadNotesTab__list">
        <ListView
          content={content}
          loading={loading}
          last={last}
          render={(item: React.ReactNode) => <NoteItem note={item as Note} />}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default React.memo(LeadNotesTab);
