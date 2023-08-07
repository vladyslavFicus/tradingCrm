import React, { useCallback } from 'react';
import { permissions } from 'config';
import { usePermission } from 'providers/PermissionsProvider';

const useNotePopover = () => {
  const permission = usePermission();

  const updateAllowed = permission.allows(permissions.NOTES.UPDATE_NOTE);
  const deleteAllowed = permission.allows(permissions.NOTES.DELETE_NOTE);

  // ===== Handlers ===== //
  const handlePopoverClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return {
    updateAllowed,
    deleteAllowed,
    handlePopoverClick,
  };
};

export default useNotePopover;
