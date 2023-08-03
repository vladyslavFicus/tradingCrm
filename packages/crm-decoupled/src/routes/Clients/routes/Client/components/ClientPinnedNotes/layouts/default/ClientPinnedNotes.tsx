import React from 'react';
import { targetTypes } from 'constants/note';
import PinnedNotes from 'components/Note/PinnedNotes';
import useClientPinnedNotes from 'routes/Clients/routes/Client/components/hooks/useClientPinnedNotes';

type Props = {
  clientUuid: string,
};

const ClientPinnedNotes = (props: Props) => {
  const { clientUuid } = props;

  const { allowViewNotes } = useClientPinnedNotes();

  return (
    <If condition={allowViewNotes}>
      <PinnedNotes targetUUID={clientUuid} targetType={targetTypes.PLAYER} />
    </If>
  );
};

export default React.memo(ClientPinnedNotes);
