import React from 'react';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { targetTypes } from 'constants/note';
import PinnedNotes from 'components/Note/PinnedNotes';

type Props = {
  clientUuid: string,
};

const ClientPinnedNotes = (props: Props) => {
  const { clientUuid } = props;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowViewNotes = permission.allows(permissions.NOTES.VIEW_NOTES);

  return (
    <If condition={allowViewNotes}>
      <PinnedNotes targetUUID={clientUuid} targetType={targetTypes.PLAYER} />
    </If>
  );
};

export default React.memo(ClientPinnedNotes);
