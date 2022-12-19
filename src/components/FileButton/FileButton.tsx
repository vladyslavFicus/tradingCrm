import React from 'react';
import classNames from 'classnames';
import './FileButton.scss';

type Props = {
  label?: string,
  onChosen: (files: File | FileList) => void,
  singleMode?: boolean,
  className?: string,
};

const FileUpload = (props: Props) => {
  const {
    label = 'Upload file',
    singleMode = true,
    className,
    onChosen,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files?.length) {
      onChosen(singleMode ? files[0] : files);
    }
  };

  return (
    <label className={classNames('FileButton', className)}>
      <input
        type="file"
        onChange={handleChange}
        multiple={!singleMode}
      />
      {label}
    </label>
  );
};

export default React.memo(FileUpload);
