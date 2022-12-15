import React from 'react';
import classNames from 'classnames';
import './NoteIcon.scss';

type IconStyle = 'new' | 'filled' | 'pinned';

type Props = {
  type: IconStyle,
  className?: string,
};

const NoteIcon = (props: Props) => {
  const { type, className } = props;

  return (
    <i className={classNames(`note-icon note-icon-${type}`, className)} />
  );
};

export default React.memo(NoteIcon);
