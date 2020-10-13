import keyMirror from 'keymirror';
import { omitBy, isNil } from 'lodash';
import { InputField, DateTimeField, NasSelectField } from '..';
import normalizeBoolean from '../../../utils/normalizeBoolean';
import normalizeNumber from '../../../utils/normalizeNumber';
import { floatNormalize } from '../../../utils/inputNormalize';

export const fieldTypes = keyMirror({
  INPUT: null,
  SELECT: null,
  DATE: null,
  RANGE: null,
});

export const validators = keyMirror({
  START_DATE: null,
  END_DATE: null,
});

export const components = {
  [fieldTypes.INPUT]: InputField,
  [fieldTypes.SELECT]: NasSelectField,
  [fieldTypes.DATE]: DateTimeField,
};

export const normalize = {
  NUMBER: normalizeNumber,
  BOOLEAN: normalizeBoolean,
  FLOAT: floatNormalize,
};

export const fieldClassNames = {
  BIG: 'filter-row__big',
  MEDIUM: 'filter-row__medium',
  SMALL: 'filter-row__small',
};

export const parser = {
  ONLY_POSITIVE: value => (value >= 0 ? value : Math.abs(value)),
};

export const getValidationRules = fields => omitBy(fields
  .reduce((acc, {
    name,
    type,
    inputType,
    fields: rangeFields,
    multiple,
    boolean,
  }) => {
    switch (type) {
      case (fieldTypes.INPUT): {
        return { ...acc, [name]: inputType === 'number' ? 'numeric' : 'string' };
      }

      case (fieldTypes.SELECT): {
        return {
          ...acc,
          [name]: multiple ? 'array' : boolean ? 'boolean' : 'string', // eslint-disable-line
        };
      }

      case (fieldTypes.DATE): {
        return { ...acc, [name]: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/' };
      }

      case (fieldTypes.RANGE): {
        return { ...acc, ...getValidationRules(rangeFields) };
      }

      default: return null;
    }
  }, {}), isNil);
