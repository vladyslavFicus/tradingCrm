import React from 'react';
import I18n from 'i18n-js';
import { Note } from '__generated__/types';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/Note/NoteItem';
import useLeadNotesTab from 'routes/Leads/routes/Lead/hooks/useLeadNotesTab';
import LeadNotesFilter from './components/LeadNotesFilter';
import './LeadNotesTab.scss';

const LeadNotesTab = () => {
  const {
    content,
    loading,
    last,
    refetch,
    handleLoadMore,
  } = useLeadNotesTab();

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
