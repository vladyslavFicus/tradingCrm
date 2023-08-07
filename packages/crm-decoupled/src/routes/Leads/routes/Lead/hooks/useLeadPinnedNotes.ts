import { permissions } from 'config';
import { usePermission } from 'providers/PermissionsProvider';

const useLeadPinnedNotes = () => {
  // ===== Permissions ===== //
  const permission = usePermission();
  const allowViewNotes = permission.allows(permissions.NOTES.VIEW_NOTES);

  return {
    allowViewNotes,
  };
};

export default useLeadPinnedNotes;
