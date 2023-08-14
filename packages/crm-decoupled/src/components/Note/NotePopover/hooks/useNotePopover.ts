import React, { useCallback } from 'react';
import { Config, usePermission } from '@crm/common';

const useNotePopover = () => {
  const permission = usePermission();

  const updateAllowed = permission.allows(Config.permissions.NOTES.UPDATE_NOTE);
  const deleteAllowed = permission.allows(Config.permissions.NOTES.DELETE_NOTE);

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
