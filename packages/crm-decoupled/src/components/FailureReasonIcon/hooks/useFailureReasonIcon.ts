import { useCallback, useState } from 'react';

type UseFailureReasonIcon = {
  isOpenPopover: boolean,
  handleTogglePopover: () => void,
};

const useFailureReasonIcon = (): UseFailureReasonIcon => {
  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false);

  const handleTogglePopover = useCallback(() => setIsOpenPopover(prevIsOpenPopover => !prevIsOpenPopover), []);

  return {
    isOpenPopover,
    handleTogglePopover,
  };
};

export default useFailureReasonIcon;
