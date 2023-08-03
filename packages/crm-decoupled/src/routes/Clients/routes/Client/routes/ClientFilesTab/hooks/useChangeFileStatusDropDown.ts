import { useState, useCallback } from 'react';

type Props = {
  uuid: string,
  status: string,
  onChangeStatus: (uuid: string, status: string) => void,
};

const useChangeFileStatusDropDown = (props: Props) => {
  const { onChangeStatus, uuid, status } = props;

  const [currentValue, setCurrentValue] = useState(status);

  // ===== Handlers ===== //
  const handleChange = useCallback((value: string) => {
    onChangeStatus(uuid, value);
    setCurrentValue(value);
  }, [onChangeStatus, uuid]);

  return {
    currentValue,
    handleChange,
  };
};

export default useChangeFileStatusDropDown;
