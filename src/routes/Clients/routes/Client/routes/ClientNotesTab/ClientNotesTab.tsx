import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { Note } from '__generated__/types';
import EventEmitter, { CLIENT_RELOAD, NOTE_RELOAD } from 'utils/EventEmitter';
import { targetTypes } from 'constants/note';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/Note/NoteItem';
import ClientNotesGridFilter from './components/ClientNotesGridFilter';
import { useClientNotesQuery, ClientNotesQueryVariables } from './graphql/__generated__/ClientNotesQuery';
import './ClientNotesTab.scss';

const ClientNotesTab = () => {
  const { id: targetUUID } = useParams<{ id: string }>();

  const { state } = useLocation<State<ClientNotesQueryVariables>>();

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
  const handleLoadMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as ClientNotesQueryVariables), 'page', number + 1),
      });
    }
  };

  // Refetch list of notes only if targetType is PLAYER
  const handleNoteReload = ({ targetType }: { targetType: string }) => {
    if (targetType === targetTypes.PLAYER) {
      refetch();
    }
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);
    EventEmitter.on(NOTE_RELOAD, handleNoteReload);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
      EventEmitter.off(NOTE_RELOAD, handleNoteReload);
    };
  }, []);


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
