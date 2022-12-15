import React from 'react';
import './Hint.scss';

type Props = {
  text: string,
  className?: string,
}

const Hint = (props: Props) => {
  const { className, text } = props;

  return (
    <span className={`Hint ${className}`}>{text}</span>
  );
};

export default React.memo(Hint);
