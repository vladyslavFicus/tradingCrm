import React from 'react';
import I18n from 'i18n-js';
import { ShortLoader } from 'components';
import NotFound from 'routes/NotFound';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import useTeamProfile from 'routes/Teams/hooks/useTeamProfile';
import './TeamProfile.scss';

const TeamProfile = () => {
  const {
    branchId,
    branchData,
    loading,
  } = useTeamProfile();

  if (loading) {
    return <ShortLoader />;
  }

  if (!branchData) {
    return <NotFound />;
  }

  return (
    <div className="TeamProfile">
      <BranchHeader
        branchData={branchData}
        branchId={branchId}
      />

      <div className="TeamProfile__body">
        <HierarchyProfileRules
          title={I18n.t('TEAMS.TABS.RULES.TITLE')}
          branchId={branchId}
        />
      </div>
    </div>
  );
};

export default React.memo(TeamProfile);
