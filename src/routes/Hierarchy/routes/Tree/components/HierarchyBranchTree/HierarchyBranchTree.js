import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import Tree from 'components/Tree';
import ShortLoader from 'components/ShortLoader';
import { branchTypes } from 'constants/hierarchyTypes';
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

  onNodeClick = ({ type, branchType, deskType, uuid }, parent = {}) => () => {
    if (type === nodeTypes.USER) {
      window.open(`/operators/${uuid}/profile`, '_blank');
    }

    if (type === nodeTypes.BRANCH && ![branchTypes.COMPANY, branchTypes.BRAND].includes(branchType)) {
      const _deskType = deskType || parent.deskType;
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
            generateNodeProps={({ node, parentNode }) => ({
              onClick: this.onNodeClick(node, parentNode),
              className: node.type === nodeTypes.USER ? 'HierarchyBranchTree__userNode' : null,
            })}
          />
        </Otherwise>
      </Choose>
    );
  }
}

export default HierarchyBranchTree;
