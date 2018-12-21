import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import RangeGroup from '../RangeGroup';
import { fieldTypes, components, validators } from './constants';

const reduxFieldsConstructor = (
  fields,
  onSelectFieldChange,
  startDateValidator,
  endDateValidator,
) => {
  if (!Array.isArray(fields)) {
    return null;
  }

  return fields
    .map(({
      id,
      type,
      name,
      label,
      className,
      placeholder,
      disabled,
      // input props
      inputType,
      inputAddon,
      normalize,
      // select props
      multiple,
      withAnyOption,
      selectOptions,
      onFieldChange,
      // date props
      dateValidator,
      pickerClassName,
      closeOnSelect,
      // rangeProps
      fields: rangeFields,
    }) => {
      if (!name && !type) {
        return null;
      }

      const commonProps = {
        name,
        ...label && { label: I18n.t(label) },
        ...className && { className },
        ...placeholder && { placeholder: I18n.t(placeholder) },
        ...disabled && { disabled },
      };
      let filter = null;

      switch (type) {
        case (fieldTypes.INPUT): {
          filter = (
            <Field
              {...commonProps}
              id={id}
              type={inputType || 'text'}
              component={components.INPUT}
              {...inputAddon && { inputAddon }}
              {...normalize && { normalize }}
            />
          );

          break;
        }

        case (fieldTypes.SELECT): {
          filter = (
            <Field
              {...commonProps}
              component={components.SELECT}
              multiple={multiple}
              {...onFieldChange && { onFieldChange: onSelectFieldChange(name) }}
              {...(withAnyOption === false)
                ? { withAnyOption }
                : (!multiple && { withAnyOption: true })
              }
            >
              {selectOptions.map(({ value, label: optionLabel }) => (
                <option key={value} value={value}>
                  {I18n.t(optionLabel)}
                </option>
              ))}
            </Field>
          );

          break;
        }

        case (fieldTypes.DATE): {
          let isValidDate = null;

          if (dateValidator) {
            if (dateValidator.type === validators.START_DATE) {
              isValidDate = startDateValidator(dateValidator.fieldName);
            }

            if (dateValidator.type === validators.END_DATE) {
              isValidDate = endDateValidator(dateValidator.fieldName);
            }
          }
          filter = (
            <Field
              {...commonProps}
              utc
              component={components.DATE}
              {...(typeof closeOnSelect === 'boolean') && { closeOnSelect }}
              {...dateValidator && { isValidDate }}
              {...pickerClassName && { pickerClassName }}
            />
          );

          break;
        }

        case (fieldTypes.RANGE): {
          filter = (
            <RangeGroup
              label={label}
              {...className && { className }}
            >
              {reduxFieldsConstructor(rangeFields, onSelectFieldChange, startDateValidator, endDateValidator)}
            </RangeGroup>
          );

          break;
        }

        default: break;
      }

      return (
        <Fragment key={name || label}>
          {filter}
        </Fragment>
      );
    })
    .filter(item => item);
};

export default reduxFieldsConstructor;
