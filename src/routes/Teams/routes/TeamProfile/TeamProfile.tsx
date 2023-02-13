import React from 'react';
import { useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import NotFound from 'routes/NotFound';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import { useBranchInfoQuery } from './graphql/__generated__/BranchInfoQuery';
import './TeamProfile.scss';

const TeamProfile = () => {
  const { id: branchId } = useParams<{ id: string }>();

  const { data, loading } = useBranchInfoQuery({ variables: { branchId } });
  const branchData = data?.branchInfo || {};

  if (!loading && !data) {
    return <NotFound />;
  }

  return (
    <div className="TeamProfile">
      <BranchHeader
        branchData={branchData}
        branchId={branchId}
        loading={loading}
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
