import { useState, useCallback } from 'react';
import { HierarchyTreeBranch, HierarchyTreeUser } from '__generated__/types';
import { useTreeBranchQueryLazyQuery } from '../graphql/__generated__/TreeBranchQuery';

type Props = {
  branch: HierarchyTreeBranch,
};

const useHierarchyItemBranch = (props: Props) => {
  const { branch } = props;

  const {
    uuid,
    brandId,
    childrenCount,
    usersCount,
  } = branch;

  const managers = branch.managers || [];

  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [children, setChildren] = useState<Array<HierarchyTreeBranch>>([]);
  const [users, setUsers] = useState<Array<HierarchyTreeUser>>([]);

  // ===== Requests ===== //
  const [treeBranchQuery] = useTreeBranchQueryLazyQuery({ variables: { uuid, brand: brandId } });

  const hasChildren = () => !!childrenCount || !!usersCount;

  // ===== Handlers ===== //
  const handleHideChildren = useCallback(() => {
    setChildren([]);
    setUsers([]);
  }, []);

  const handleExpandChildren = useCallback(async () => {
    setLoading(true);
    const response = await treeBranchQuery();

    const branchChildren = response.data?.treeBranch?.children || [];
    const branchUsers = response.data?.treeBranch?.users || [];

    setChildren(branchChildren);
    setUsers(branchUsers);
    setLoading(false);
  }, []);

  return {
    managers,
    loading,
    hover,
    setHover,
    children,
    users,
    hasChildren,
    handleHideChildren,
    handleExpandChildren,
  };
};

export default useHierarchyItemBranch;
