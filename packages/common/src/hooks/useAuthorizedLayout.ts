import { useEffect, useState } from 'react';
import { useStorageState, Auth } from '@crm/common';
import { getBackofficeBrand, getBrand } from '../config';

type UseUseAuthorizedLayout = {
  sidebarPosition: 'left' | 'right',
  isShowProductionAlert: boolean,
  token: string,
  auth: Auth | undefined,
  downtime: {
    title: string,
    show: boolean,
  },
}

const useAuthorizedLayout = ():UseUseAuthorizedLayout => {
  const [downtime, setDowntime] = useState({ title: '', show: false });

  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');
  const [auth] = useStorageState<Auth | undefined>('auth');

  // ===== Effects ===== //
  useEffect(() => {
    (async () => {
      const response = await fetch(`/cloud-static/DOWNTIME.json?${Math.random()}`);

      const responseDowntime = await response.json();

      if (response.status === 200 && responseDowntime?.show) {
        setDowntime(responseDowntime);
      }
    })();
  }, []);

  const sidebarPosition = getBackofficeBrand()?.sidebarPosition || 'left';
  const isShowProductionAlert = auth?.department === 'ADMINISTRATION' && getBrand()?.env?.includes('prod');

  return {
    sidebarPosition,
    isShowProductionAlert,
    token,
    auth,
    downtime,
  };
};

export default useAuthorizedLayout;
