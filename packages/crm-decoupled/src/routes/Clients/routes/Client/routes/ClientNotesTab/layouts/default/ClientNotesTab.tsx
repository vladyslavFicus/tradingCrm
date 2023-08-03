import React from 'react';
import I18n from 'i18n-js';
import { Note } from '__generated__/types';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/Note/NoteItem';
import useClientNotesTab from 'routes/Clients/routes/Client/routes/ClientNotesTab/hooks/useClientNotesTab';
import ClientNotesGridFilter from './components/ClientNotesGridFilter';
import './ClientNotesTab.scss';

const ClientNotesTab = () => {
  const {
    refetch,
    last,
    content,
    loading,
    handleLoadMore,
  } = useClientNotesTab();

  return (
    <div className="ClientNotesTab">
      <TabHeader title={I18n.t('PLAYER_PROFILE.NOTES.TITLE')} />

      <ClientNotesGridFilter onRefetch={refetch} />

      <div className="ClientNotesTab__grid">
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

export default React.memo(ClientNotesTab);
