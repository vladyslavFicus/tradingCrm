import React from 'react';
import classNames from 'classnames';
import useFileButton from '../hooks/useFileButton';
import './FileButton.scss';

type Props = {
  label?: string,
  onChosen: (files: File | FileList) => void,
  singleMode?: boolean,
  className?: string,
};

const FileButton = (props: Props) => {
  const {
    label = 'Upload file',
    singleMode = true,
    className,
    onChosen,
  } = props;

  const { handleChange } = useFileButton({ onChosen, singleMode });

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

export default React.memo(FileButton);
