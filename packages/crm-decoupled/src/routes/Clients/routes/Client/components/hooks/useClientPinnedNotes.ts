import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';

type UseClientPinnedNotes = {
  allowViewNotes: boolean,
};

const useClientPinnedNotes = (): UseClientPinnedNotes => {
  // ===== Permissions ===== //
  const permission = usePermission();
  const allowViewNotes = permission.allows(permissions.NOTES.VIEW_NOTES);

  return {
    allowViewNotes,
  };
};

export default useClientPinnedNotes;
