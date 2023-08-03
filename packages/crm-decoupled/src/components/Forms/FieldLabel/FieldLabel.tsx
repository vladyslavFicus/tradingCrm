import React from 'react';

type Props = {
  label?: string | object,
  className?: string,
};

const FieldLabel = (props: Props) => {
  const { label, className } = props;

  return (
    <If condition={!!label}>
      <label className={className}>{label}</label>
    </If>
  );
};

export default React.memo(FieldLabel);
