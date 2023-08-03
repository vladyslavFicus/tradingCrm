import { useCallback, useState } from 'react';

type UseFailedStatusIcon = {
  tooltipOpen: boolean,
  onToggle: () => void,
};

const useFailedStatusIcon = (): UseFailedStatusIcon => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const onToggle = useCallback(() => setTooltipOpen(prevTooltipOpen => !prevTooltipOpen), []);

  return {
    tooltipOpen,
    onToggle,
  };
};

export default useFailedStatusIcon;
