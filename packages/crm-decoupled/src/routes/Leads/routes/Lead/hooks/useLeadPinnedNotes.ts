import { Config } from '@crm/common';
import { usePermission } from 'providers/PermissionsProvider';

const useLeadPinnedNotes = () => {
  // ===== Permissions ===== //
  const permission = usePermission();
  const allowViewNotes = permission.allows(Config.permissions.NOTES.VIEW_NOTES);

  return {
    allowViewNotes,
  };
};

export default useLeadPinnedNotes;
