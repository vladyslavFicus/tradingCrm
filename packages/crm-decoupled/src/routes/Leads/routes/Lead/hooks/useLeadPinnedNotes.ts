import { Config, usePermission } from '@crm/common';

const useLeadPinnedNotes = () => {
  // ===== Permissions ===== //
  const permission = usePermission();
  const allowViewNotes = permission.allows(Config.permissions.NOTES.VIEW_NOTES);

  return {
    allowViewNotes,
  };
};

export default useLeadPinnedNotes;
