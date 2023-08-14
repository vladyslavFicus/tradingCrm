import React from 'react';
import { Constants } from '@crm/common';
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
      <PinnedNotes targetUUID={clientUuid} targetType={Constants.targetTypes.PLAYER} />
    </If>
  );
};

export default React.memo(ClientPinnedNotes);
