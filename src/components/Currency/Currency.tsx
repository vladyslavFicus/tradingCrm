import React from 'react';
import { currencySettings } from './constants';
import './Currency.scss';

type Props = {
  code: string,
};

const Currency = (props: Props) => {
  const { code } = props;

  const symbol = currencySettings[code] ? currencySettings[code].symbol : code;

  return (
    <span className="Currency__symbol">{symbol}</span>
  );
};

export default React.memo(Currency);
