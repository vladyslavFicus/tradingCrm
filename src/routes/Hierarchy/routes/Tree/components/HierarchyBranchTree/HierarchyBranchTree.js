import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import Tree from 'components/Tree';
import ShortLoader from 'components/ShortLoader';
import { branchTypes, userTypes } from 'constants/hierarchyTypes';
import { buildTreeDataFromBranchTree } from './utils';
import { nodeTypes } from './constants';
import './HierarchyBranchTree.scss';

class HierarchyBranchTree extends PureComponent {
  static propTypes = {
    branchHierarchyTree: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      hierarchy: PropTypes.object,
    }).isRequired,
  };

  onNodeClick = ({ type, branchType, deskType, uuid, userType }, parent = {}) => () => {
    if (type === nodeTypes.USER) {
      const rootUrl = userType === userTypes.AFFILIATE_PARTNER ? 'partners' : 'operators';
      window.open(`/${rootUrl}/${uuid}/profile`, '_blank');
    }

    if (type === nodeTypes.BRANCH && ![branchTypes.COMPANY, branchTypes.BRAND].includes(branchType)) {
      const _deskType = deskType || (parent && parent.deskType);
      const ruleUrl = _deskType ? `/${_deskType.toLowerCase()}-rules` : '';
      window.open(`/${branchType.toLowerCase()}s/${uuid}/rules${ruleUrl}`, '_blank');
    }
  };

  render() {
    const { branchHierarchyTree: { loading, hierarchy } } = this.props;

    const branchTree = get(hierarchy, 'branchHierarchyTree.data') || {};
    const error = get(hierarchy, 'branchHierarchyTree.error');

    return (
      <Choose>
        <When condition={loading || error}>
          <ShortLoader />
        </When>
        <Otherwise>
          <Tree
            isVirtualized={false}
            canDrag={false}
            treeData={buildTreeDataFromBranchTree(branchTree)}
            generateNodeProps={({ node, parentNode, expandAllNodes }) => ({
              onClick: this.onNodeClick(node, parentNode),
              className: node.type === nodeTypes.USER ? 'HierarchyBranchTree__userNode' : null,
              buttons: (!node.expanded && node.children) ? [
                <button
                  type="button"
                  title="Expand all down"
                  onClick={expandAllNodes}
                  className="HierarchyBranchTree__expandAll"
                >
                  <i className="fa fa-arrow-down" />
                </button>,
              ] : [],
            })}
          />
        </Otherwise>
      </Choose>
    );
  }
}

export default HierarchyBranchTree;
