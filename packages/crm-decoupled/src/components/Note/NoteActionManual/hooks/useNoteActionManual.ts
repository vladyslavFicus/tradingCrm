import React, { useCallback, useState } from 'react';
import { v4 } from 'uuid';
import { debounce } from 'lodash';
import { Types } from '@crm/common';

type Props = {
  playerUUID: string,
  targetUUID: string,
  targetType: string,
  onEditSuccess: (values: Types.EditNote) => void,
  onDeleteSuccess: () => void,
};

const useNoteActionManual = (props: Props) => {
  const {
    onEditSuccess,
    onDeleteSuccess,
    playerUUID,
    targetUUID,
    targetType,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [targetId] = useState(`note-${v4()}`);

  // ===== Handlers ===== //
  const handleSetDirty = debounce((dirty: boolean) => setIsDirty(dirty), 100);

  const handleClose = useCallback((ignoreChanges = false) => {
    if (ignoreChanges || !isDirty) {
      setIsOpen(false);
    }
  }, [isDirty]);

  const handleOpen = useCallback((e: React.MouseEvent | undefined) => {
    if (e) {
      e.stopPropagation();
    }

    setIsOpen(true);
  }, []);

  const handleRemoveNote = useCallback(() => {
    onDeleteSuccess();
    handleClose(true);
  }, [onDeleteSuccess, handleClose]);

  const handleSubmit = useCallback((formValues: Types.FormValues) => {
    const variables = { ...formValues, targetUUID, playerUUID, targetType };

    onEditSuccess(variables);
    handleClose(true);
  }, [targetUUID, playerUUID, targetType, handleClose]);

  return {
    isOpen,
    isDirty,
    targetId,
    handleSetDirty,
    handleOpen,
    handleClose,
    handleRemoveNote,
    handleSubmit,
  };
};

export default useNoteActionManual;
