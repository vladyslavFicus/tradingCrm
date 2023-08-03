import { useState, useCallback } from 'react';
import { VerificationType } from '../types/clientFilesGrid';

type Props = {
  verificationType: string,
  documentType: string,
  onMoveChange: (value: VerificationType) => void,
};

const useMoveFileDropDown = (props: Props) => {
  const { verificationType, documentType, onMoveChange } = props;

  const [currentValue, setCurrentValue] = useState(JSON.stringify({ verificationType, documentType }));

  // ===== Handlers ===== //
  const handleChange = useCallback((value: string) => {
    onMoveChange(JSON.parse(value));
    setCurrentValue(value);
  }, [onMoveChange]);

  return {
    currentValue,
    handleChange,
  };
};

export default useMoveFileDropDown;
