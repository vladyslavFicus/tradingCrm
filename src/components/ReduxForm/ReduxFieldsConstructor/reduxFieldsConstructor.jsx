import React, { Fragment } from 'react';
import I18n from 'i18n-js';
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
      parse,
      withoutI18n,
      // input props
      inputType,
      inputAddon,
      onIconClick,
      normalize,
      step,
      maxLength,
      // select props
      multiple,
      searchable,
      withAnyOption,
      selectOptions,
      customOnChange,
      optionsWithoutI18n,
      // date props
      dateValidator,
      pickerClassName,
      closeOnSelect,
      withTime,
      timePresets,
      isDateRangeEndValue,
      br,
      // rangeProps
      fields: rangeFields,
    }) => {
      if (!name && !type) {
        return null;
      }

      let filter = null;
      const commonProps = {
        name,
        ...label && { label: withoutI18n ? label : I18n.t(label) },
        ...className && { className },
        ...placeholder && { placeholder: withoutI18n ? placeholder : I18n.t(placeholder) },
        ...disabled && { disabled },
        ...parse && { parse },
      };

      switch (type) {
        case (fieldTypes.INPUT): {
          filter = (
            <Field
              {...commonProps}
              id={id}
              type={inputType || 'text'}
              step={step}
              component={components.INPUT}
              {...inputAddon && { inputAddon }}
              {...onIconClick && { onIconClick }}
              {...normalize && { normalize }}
              {...maxLength && { maxLength }}
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
              {...customOnChange && { onFieldChange: onSelectFieldChange(name) }}
              {...(searchable === false) && { searchable }}
              {...(withAnyOption === false)
                ? { withAnyOption }
                : (!multiple && { withAnyOption: true })
              }
            >
              {selectOptions.map(({ value, label: optionLabel, ...rest }) => (
                <option key={value} value={value} {...rest}>
                  {optionsWithoutI18n ? optionLabel : I18n.t(optionLabel)}
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
              {...withTime && { withTime }}
              {...timePresets && { timePresets }}
              {...isDateRangeEndValue && { isDateRangeEndValue }}
            />
          );

          break;
        }

        case (fieldTypes.RANGE): {
          filter = (
            <RangeGroup
              label={I18n.t(label)}
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
          <If condition={br}>
            <div style={{ width: '100%' }} />
          </If>
        </Fragment>
      );
    })
    .filter(item => item);
};

export default reduxFieldsConstructor;
