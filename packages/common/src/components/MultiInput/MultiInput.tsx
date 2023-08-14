import React, { useState, useMemo, useEffect } from 'react';
import { difference } from 'lodash';
import CreatableSelect from 'react-select/lib/Creatable';
import { createTagOption, selectStyles, components } from 'constants/multiInput';

type Tag = {
  label: string,
  value: string,
}

type Props = {
  onChange: (values: Array<string>) => void,
  disabled?: boolean,
  placeholder?: string,
  initialValues?: Array<Tag>,
  isError?: boolean,
}

const MultiInput = (props: Props) => {
  const {
    onChange,
    disabled,
    placeholder = '',
    initialValues = [],
    isError,
  } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const [tags, setTags] = useState<Array<Tag>>(initialValues);

  useEffect(() => {
    const isDifferent = difference(initialValues, tags).length;

    // Set initial tags
    if (isDifferent) {
      setTags(initialValues);
    }
  }, [initialValues]);

  const styles = useMemo(() => selectStyles(isError), [isError, selectStyles]);

  const handleChange = (_tags: Array<Tag>) => {
    setTags(_tags);
    setInputValue('');
    onChange(_tags.map(({ value }) => value));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputValue) return;

    if ([13, 9].includes(event.which)) {
      event.preventDefault();

      // Сhecking for already existing value
      if (!tags.find(({ value }) => value === inputValue)) {
        handleChange([...tags, createTagOption(inputValue)]);
      }
    }
  };

  return (
    <CreatableSelect
      isMulti
      classNamePrefix="MultiInput"
      components={components}
      inputValue={inputValue}
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={setInputValue}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      value={tags}
      isDisabled={disabled}
      styles={styles}
    />
  );
};

export default React.memo(MultiInput);
