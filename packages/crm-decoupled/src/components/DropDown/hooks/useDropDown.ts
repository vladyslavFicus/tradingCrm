import { useCallback, useState } from 'react';

type UseDropDown = {
  open: boolean,
  toggleState: () => void,
};

const useDropDown = (): UseDropDown => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleState = useCallback(() => setOpen(prevOpen => !prevOpen), []);

  return {
    open,
    toggleState,
  };
};

export default useDropDown;
