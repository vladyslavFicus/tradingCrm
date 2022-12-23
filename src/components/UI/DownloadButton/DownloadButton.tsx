import React from 'react';
import classNames from 'classnames';
import { Button } from 'components/UI';
import './DownloadButton.scss';

type Props = {
  className?: string,
  onClick?: () => void,
};

const DownloadButton = (props: Props) => {
  const { className, onClick } = props;

  return (
    <Button
      className={classNames('DownloadButton', className)}
      onClick={onClick}
    >
      <i className="DownloadButton__icon fa fa-download" />
    </Button>
  );
};

export default React.memo(DownloadButton);
