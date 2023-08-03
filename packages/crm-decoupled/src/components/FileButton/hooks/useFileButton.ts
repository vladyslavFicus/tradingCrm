import React, { useCallback } from 'react';

type Props = {
  onChosen: (files: File | FileList) => void,
  singleMode?: boolean,
};

const useFileButton = (props: Props) => {
  const {
    singleMode = true,
    onChosen,
  } = props;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files?.length) {
      onChosen(singleMode ? files[0] : files);
    }
  }, [singleMode]);

  return {
    handleChange,
  };
};

export default useFileButton;
