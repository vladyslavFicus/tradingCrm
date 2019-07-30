import { nodeTypes } from './constants';

export const buildTreeDataFromBranchTree = (branchTree, isChild = false) => {
  const hasChildren = Array.isArray(branchTree.children) && branchTree.children.length;
  const hasUsers = Array.isArray(branchTree.users) && branchTree.users.length;

  const treeData = {
    title: branchTree.name,
    subtitle: branchTree.branchType,
    type: nodeTypes.BRANCH,
    branchType: branchTree.branchType,
    uuid: branchTree.uuid,
    deskType: branchTree.deskType,
    expanded: false,
  };

  if (hasChildren || hasUsers) {
    treeData.children = [
      ...hasChildren ? branchTree.children.map(tree => buildTreeDataFromBranchTree(tree, true)) : [],
      ...hasUsers ? branchTree.users.map(user => ({
        title: user.operator.fullName,
        subtitle: user.userType,
        type: nodeTypes.USER,
        userType: user.userType,
        uuid: user.uuid,
      })) : [],
    ];
  }

  return isChild ? treeData : [treeData];
};
