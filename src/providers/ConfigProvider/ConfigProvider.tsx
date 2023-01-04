import React from 'react';
import config, { getBrand } from 'config';
import Preloader from 'components/Preloader';
import { useConfigQuery } from './graphql/__generated__/ConfigQuery';

type Props = {
  children: React.ReactElement,
};

const ConfigProvider = (props: Props) => {
  const { children } = props;

  const { data, loading } = useConfigQuery({ variables: { brandId: getBrand().id } });

  if (loading && !data?.config) {
    return <Preloader />;
  }

  config.brand = { ...config.brand, ...data?.config };

  return children;
};

export default React.memo(ConfigProvider);
