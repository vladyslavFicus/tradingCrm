import React from 'react';
import useCurrency from '../hooks/useCurrency';
import './Currency.scss';

type Props = {
  code: string,
};

const Currency = (props: Props) => {
  const { code } = props;

  const symbol = useCurrency(code);

  return (
    <span className="Currency__symbol">{symbol}</span>
  );
};

export default React.memo(Currency);
