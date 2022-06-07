import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import HierarchyItemBranch from '../Tree/HierarchyItemBranch';
import TreeTopQuery from './graphql/TreeTopQuery';
import './Hierarchy.scss';

class Hierarchy extends PureComponent {
  static propTypes = {
    treeTopQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.treeBranch)).isRequired,
  };

  render() {
    const { treeTopQuery } = this.props;

    const branches = treeTopQuery.data?.treeTop || [];

    return (
      <div className="Hierarchy">
        <div className="Hierarchy__header">
          <span>
            {I18n.t('HIERARCHY.TREE.HEADING')}
          </span>
        </div>
        <div className="Hierarchy__content">
          <Choose>
            <When condition={treeTopQuery.loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              {branches.map(branch => <HierarchyItemBranch key={branch.uuid} {...branch} />)}
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default withRequests({
  treeTopQuery: TreeTopQuery,
})(Hierarchy);
