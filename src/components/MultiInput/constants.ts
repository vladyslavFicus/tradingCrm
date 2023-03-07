import { CSSProperties } from 'react';

export const components = {
  DropdownIndicator: null,
  ClearIndicator: null,
  IndicatorSeparator: null,
};

export const createTagOption = (label: string) => ({
  label,
  value: label,
});

type State = {
  isDisabled: boolean,
}

export const selectStyles = (isError?: boolean) => ({
  control: (base: CSSProperties, { isDisabled }: State) => ({
    ...base,
    backgroundColor: 'var(--form-background-default)',
    borderColor: 'var(--form-border-default)',
    boxShadow: 'none',

    ':hover': {
      borderColor: 'var(--form-border-hover)',
    },

    ...(isDisabled && {
      backgroundColor: 'var(--form-background-disabled)',
      borderColor: 'var(--form-border-disabled)',
      color: 'var(--form-color-disabled)',
    }),

    ...(isError && {
      borderColor: 'var(--state-colors-danger)',

      ':hover': {
        borderColor: 'var(--form-border-focus)',
      },
    }),
  }),
  input: (base: CSSProperties) => ({
    ...base,
    color: 'var(--form-color-default)',
  }),
  placeholder: (base: CSSProperties) => ({
    ...base,
    color: 'var(--form-color-placeholder)',
  }),
  multiValue: (base: CSSProperties) => ({
    ...base,
    backgroundColor: 'var(--form-background-selected)',
  }),
  multiValueLabel: (base: CSSProperties) => ({
    ...base,
    fontWeight: '600',
    fontSize: '13px',
    color: 'var(--form-color-focus)',
  }),
  multiValueRemove: (base: CSSProperties) => ({
    ...base,
    minWidth: '20px',

    ':hover': {
      background: 'none',
      backgroundColor: 'none',
      color: 'var(--state-colors-danger)',
      cursor: 'pointer',
    },
  }),
});
