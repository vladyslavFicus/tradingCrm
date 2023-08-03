import React from 'react';
import { Errors, Files } from 'components/FileUpload/types';
import useFileUpload from 'components/FileUpload/hooks/useFileUpload';
import FileButton from '../../FileButton';

type Props = {
  onChosen: (errors: Errors | Array<Errors>, files: Files) => void,
  label: string,
  allowedSize?: number,
  incorrectFileSize?: string,
  invalidFileType?: string,
  allowedTypes?: Array<string>,
  singleMode?: boolean,
  'data-testid'?: string,
};

const FileUpload = (props: Props) => {
  const { handleChoose } = useFileUpload(props);

  return (
    <FileButton
      {...props}
      onChosen={handleChoose}
    />
  );
};

export default React.memo(FileUpload);
