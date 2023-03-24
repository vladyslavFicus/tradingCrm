import React from 'react';
import permissions from 'config/permissions';
import { targetTypes } from 'constants/note';
import PinnedNotes from 'components/Note/PinnedNotes';
import './LeadPinnedNotes.scss';
import { usePermission } from 'providers/PermissionsProvider';

type Props = {
  uuid: string,
};

const LeadPinnedNotes = (props: Props) => {
  const { uuid } = props;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowViewNotes = permission.allows(permissions.NOTES.VIEW_NOTES);

  return (
    <If condition={allowViewNotes}>
      <div className="LeadPinnedNotes">
        <PinnedNotes targetUUID={uuid} targetType={targetTypes.LEAD} />
      </div>
    </If>
  );
};

export default React.memo(LeadPinnedNotes);
