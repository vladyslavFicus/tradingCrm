import React from 'react';
import I18n from 'i18n-js';
import { Field, FieldArray } from 'formik';
import { attributeLabels } from 'constants/ruleModal';
import { Operator, RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { TrashButton } from 'components/Buttons';
import { validationErrors } from './constants';
import './RuleOperatorSpreads.scss';

/**
 * This is reused part of outer Formik form.
 * It may lay in a different level of fields nesting,
 * so it's important to have namePrefix param to provide right fields path for Formik search engine
 */

type Props = {
  operators: Array<Operator>,
  operatorSpreads: Array<RuleOperatorSpread>,
  namePrefix: string,
  disabled: boolean,
  validationError?: string,
  removeOperatorSpread: (index: number) => void,
};

const RuleOperatorSpreads = (props: Props) => {
  const {
    operators,
    operatorSpreads,
    namePrefix,
    disabled,
    validationError,
    removeOperatorSpread,
  } = props;

  const selectedOperators = operatorSpreads.map(({ parentUser }) => parentUser);
  const error = validationError && validationErrors[validationError] && I18n.t(validationErrors[validationError]);

  return (
    <div className="row">
      <FieldArray
        name={namePrefix}
        render={() => (
          <>
            <div className="RuleOperatorSpreads__spread">
              <div className="RuleOperatorSpreads__label">{I18n.t(attributeLabels.operator)}</div>
              <div className="RuleOperatorSpreads__label">{I18n.t(attributeLabels.ratio)}</div>
            </div>

            {[...operatorSpreads, ''].map((_, index) => (
              <div className="RuleOperatorSpreads__spread" key={index}>
                <Field
                  name={`${namePrefix}[${index}].parentUser`}
                  component={FormikSelectField}
                  disabled={disabled}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  searchable
                >
                  {operators
                    .map(({ uuid, fullName }) => (
                      <option
                        key={uuid}
                        value={uuid}
                        disabled={selectedOperators.includes(uuid)}
                      >
                        {fullName}
                      </option>
                    ))
                  }
                </Field>

                <Field
                  name={`${namePrefix}[${index}].percentage`}
                  type="number"
                  placeholder={index === 0 ? '100%' : '0%'}
                  disabled={disabled || !operatorSpreads[index]}
                  component={FormikInputField}
                />

                <If condition={operatorSpreads?.length !== index}>
                  <TrashButton
                    className="RuleOperatorSpreads__button"
                    onClick={() => removeOperatorSpread(index)}
                  />
                </If>
              </div>
            ))}
          </>
        )}
      />

      <If condition={!!error}>
        <div className="RuleOperatorSpreads__validation-error">
          {error}
        </div>
      </If>
    </div>
  );
};

export default React.memo(RuleOperatorSpreads);
