import { useCallback } from 'react';
import { Errors, Files } from '../types';

type Props = {
  onChosen: (errors: Errors | Array<Errors>, files: Files) => void,
  label: string,
  allowedSize?: number,
  incorrectFileSize?: string,
  invalidFileType?: string,
  allowedTypes?: Array<string>,
  singleMode?: boolean,
};

type UseFileUpload = {
  handleChoose: (files: Files) => void,
};

const useFileUpload = (props: Props): UseFileUpload => {
  const {
    incorrectFileSize = 'FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.SIZE_LIMIT_ERROR',
    invalidFileType = 'FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.FILE_TYPE_ERROR',
    allowedTypes,
    allowedSize = 16,
    singleMode = true,
    onChosen,
  } = props;

  const validate = (file: File) => {
    const errors: Errors = [];

    if (!file) {
      return errors;
    }

    if (allowedTypes?.length && allowedTypes.indexOf(file.type) === -1) {
      errors.push(invalidFileType);
    }

    if (file.size > allowedSize * (1024 * 1024)) {
      errors.push(incorrectFileSize);
    }

    return errors;
  };

  const handleChoose = useCallback((files: Files) => {
    const errors = !singleMode
      ? Object.keys(files).map((_, index) => validate((files as FileList)[index]))
      : validate(files as File);

    onChosen(errors, files);
  }, [singleMode]);

  return {
    handleChoose,
  };
};

export default useFileUpload;
