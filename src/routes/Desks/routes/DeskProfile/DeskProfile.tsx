import React from 'react';
import { useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import ShortLoader from 'components/ShortLoader';
import NotFound from 'routes/NotFound';
import BranchHeader from 'components/BranchHeader';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import { useBranchInfoQuery } from './graphql/__generated__/BranchInfoQuery';
import './DeskProfile.scss';

const DeskProfile = () => {
  const { id: branchId } = useParams<{ id: string }>();

  const { data, loading } = useBranchInfoQuery({ variables: { branchId } });
  const branchData = data?.branchInfo;

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
