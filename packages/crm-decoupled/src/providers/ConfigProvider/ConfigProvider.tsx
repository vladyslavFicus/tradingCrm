import React from 'react';
import { Config } from '@crm/common';
import Preloader from 'components/Preloader';
import { useConfigQuery } from './graphql/__generated__/ConfigQuery';

type Props = {
  children: React.ReactNode,
};

const ConfigProvider = (props: Props) => {
  const { children } = props;

  const { data, loading } = useConfigQuery({ variables: { brandId: Config.getBrand().id } });

  if (loading && !data?.config) {
    return <Preloader />;
  }

  Config.config.brand = { ...Config.config.brand, ...data?.config };

  return (
    <>
      {children}
    </>
  );
};

export default React.memo(ConfigProvider);
