import { useMemo } from 'react';
import { HierarchyTreeUser } from '__generated__/types';

type Props = {
  branchBrandId: string,
  user: HierarchyTreeUser,
};

const useHierarchyItemUser = (props: Props) => {
  const {
    branchBrandId,
    user: {
      operator,
    },
  } = props;

  // Filter authorities only for brand where branch was created
  const authorities = operator?.authorities || [];
  const brandAuthorities = useMemo(() => authorities.filter(({ brand }) => brand === branchBrandId), [authorities]);

  const [authority] = brandAuthorities;

  return {
    authorities,
    authority,
  };
};

export default useHierarchyItemUser;
