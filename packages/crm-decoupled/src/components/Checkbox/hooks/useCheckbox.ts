import React, { useCallback } from 'react';
import { v4 } from 'uuid';

type Props = {
  onChange: () => void,
}

type UseCheckbox = {
  id: string,
  handleKeyPress: (e: React.KeyboardEvent<HTMLSpanElement>) => void,
};

const useCheckbox = (props: Props): UseCheckbox => {
  const { onChange } = props;

  const id = `checkbox-${v4()}`;

  /**
   * Change value by press on space or enter button
   *
   * @param e
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (['Space', 'Enter'].includes(e.code)) {
      onChange();
    }
  }, []);

  return {
    id,
    handleKeyPress,
  };
};

export default useCheckbox;
