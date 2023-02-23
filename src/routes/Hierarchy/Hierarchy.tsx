import React from 'react';
import I18n from 'i18n-js';
import ShortLoader from 'components/ShortLoader';
import HierarchyItemBranch from './components/HierarchyItemBranch';
import { useTreeTopQuery } from './graphql/__generated__/TreeTopQuery';
import './Hierarchy.scss';

const Hierarchy = () => {
  // ===== Requests ===== //
  const { data, loading } = useTreeTopQuery();

  const branches = data?.treeTop || [];

  return (
    <div className="Hierarchy">
      <div className="Hierarchy__header">
        {I18n.t('HIERARCHY.TREE.HEADING')}
      </div>

      <div className="Hierarchy__content">
        <Choose>
          <When condition={loading}>
            <ShortLoader />
          </When>

          <Otherwise>
            {branches.map(branch => <HierarchyItemBranch key={branch.uuid} branch={branch} />)}
          </Otherwise>
        </Choose>
      </div>
    </div>
  );
};

export default React.memo(Hierarchy);
