import React from 'react';
import I18n from 'i18n-js';
import ShortLoader from 'components/ShortLoader';
import NotFound from 'routes/NotFound';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import useDeskProfile from 'routes/Desks/routes/hooks/useDeskProfile';
import './DeskProfile.scss';

const DeskProfile = () => {
  const {
    loading,
    branchData,
    branchId,
  } = useDeskProfile();

  if (loading) {
    return <ShortLoader />;
  }

  if (!branchData) {
    return <NotFound />;
  }

  return (
    <div className="DeskProfile">
      <BranchHeader
        branchData={branchData}
        branchId={branchId}
      />

      <div className="DeskProfile__body">
        <HierarchyProfileRules
          title={I18n.t('DESKS.TABS.RULES.TITLE')}
          branchId={branchId}
        />
      </div>
    </div>
  );
};

export default React.memo(DeskProfile);
