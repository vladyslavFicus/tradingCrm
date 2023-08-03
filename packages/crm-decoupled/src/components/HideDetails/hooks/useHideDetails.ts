import { useCallback, useState } from 'react';

const useHideDetails = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleCollapseBlock = useCallback(() => setCollapsed(prevCollapsed => !prevCollapsed), []);

  return {
    collapsed,
    handleCollapseBlock,
  };
};

export default useHideDetails;
