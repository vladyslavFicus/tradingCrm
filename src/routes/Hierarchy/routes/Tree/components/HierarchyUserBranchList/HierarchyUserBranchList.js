import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import ShortLoader from 'components/ShortLoader';
import HierarchyUserBranchItem from '../HierarchyUserBranchItem';

class HierarchyUserBranchList extends PureComponent {
  static propTypes = {
    userHierarchy: PropTypes.object.isRequired,
  };

  render() {
    const {
      userHierarchy,
      userHierarchy: { loading },
    } = this.props;

    const branches = get(userHierarchy, 'hierarchy.userHierarchy.data.parentBranches', []);

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20">
            {I18n.t('HIERARCHY.TREE.HEADING')}
          </span>
        </div>
        <div className="card-body">
          <Choose>
            <When condition={loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              {branches.map(branch => <HierarchyUserBranchItem key={branch.uuid} branch={branch} />)}
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default HierarchyUserBranchList;
