import React from 'react';
import { Input } from '..';

type Props = {
  onChange: (value: number | null) => void,
  min?: number,
  max?: number,
  onError?: () => void,
};

const InputRange = (props: Props & Omit<React.ComponentProps<typeof Input>, 'children'>) => {
  const {
    min = 1,
    max = 1000,
    onChange,
    onError,
    ...rest
  } = props;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {
        value,
        validity: { valid },
      },
    } = event;

    if (!valid) {
      return;
    }

    const inputValue = parseInt(value, 10);

    if (((inputValue <= max && inputValue >= min) || !value)) {
      onChange(value !== '' ? inputValue : null);
    } else if ((inputValue > max || inputValue < min) && onError) {
      onError();
    }
  };

  return (
    <Input {...rest} onChange={handleInputChange} />
  );
};

export default React.memo(InputRange);
