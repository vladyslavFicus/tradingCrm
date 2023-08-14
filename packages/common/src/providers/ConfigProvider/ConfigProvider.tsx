import React from 'react';
import { getBrand, config } from '../../config';
import { Preloader } from '../../components';
import { useConfigQuery } from './graphql/__generated__/ConfigQuery';

type Props = {
  children: React.ReactNode,
};

const ConfigProvider = (props: Props) => {
  const { children } = props;

  const { data, loading } = useConfigQuery({ variables: { brandId: getBrand().id } });

  if (loading && !data?.config) {
    return <Preloader />;
  }

  config.brand = { ...config.brand, ...data?.config };

  return (
    <>
      {children}
    </>
  );
};

export default React.memo(ConfigProvider);
