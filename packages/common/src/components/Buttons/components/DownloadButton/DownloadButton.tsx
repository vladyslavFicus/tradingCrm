import React from 'react';
import classNames from 'classnames';
import Button from '../../Button';
import './DownloadButton.scss';

const DownloadButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { className, onClick, ...rest } = props;

  return (
    <Button
      {...rest}
      className={classNames('DownloadButton', className)}
      onClick={onClick}
    >
      <i className="DownloadButton__icon fa fa-download" />
    </Button>
  );
};

export default React.memo(DownloadButton);
