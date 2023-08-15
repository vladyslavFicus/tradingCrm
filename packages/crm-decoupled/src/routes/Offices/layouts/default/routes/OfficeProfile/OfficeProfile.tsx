import React from 'react';
import I18n from 'i18n-js';
import { ShortLoader } from 'components';
import NotFound from 'routes/NotFound';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import useOfficeProfile from 'routes/Offices/hooks/useOfficeProfile';
import './OfficeProfile.scss';

const OfficeProfile = () => {
  const {
    branchId,
    branchData,
    loading,
  } = useOfficeProfile();

  if (loading) {
    return <ShortLoader />;
  }

  if (!branchData) {
    return <NotFound />;
  }

  return (
    <div className="OfficeProfile">
      <BranchHeader
        branchData={branchData}
        branchId={branchId}
      />

      <div className="OfficeProfile__body">
        <HierarchyProfileRules
          title={I18n.t('OFFICES.TABS.RULES.TITLE')}
          branchId={branchId}
        />
      </div>
    </div>
  );
};

export default React.memo(OfficeProfile);
