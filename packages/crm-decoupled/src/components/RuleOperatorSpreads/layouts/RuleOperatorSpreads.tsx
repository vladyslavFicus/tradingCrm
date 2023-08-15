import React from 'react';
import I18n from 'i18n-js';
import { Field, FieldArray } from 'formik';
import { Constants } from '@crm/common';
import { TrashButton, FormikSingleSelectField, FormikInputField } from 'components';
import { Operator, RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';
import useRuleOperatorSpreads from '../hooks/useRuleOperatorSpreads';
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

  const { selectedOperators, error } = useRuleOperatorSpreads({ operatorSpreads, validationError });

  return (
    <div className="row">
      <FieldArray
        name={namePrefix}
        render={() => (
          <>
            <div className="RuleOperatorSpreads__spread">
              <div className="RuleOperatorSpreads__label">{I18n.t(Constants.ruleAttributeLabels.operator)}</div>
              <div className="RuleOperatorSpreads__label">{I18n.t(Constants.ruleAttributeLabels.ratio)}</div>
            </div>

            {[...operatorSpreads, ''].map((_, index) => (
              <div className="RuleOperatorSpreads__spread" key={index}>
                <Field
                  searchable
                  name={`${namePrefix}[${index}].parentUser`}
                  data-testid="RuleOperatorSpreads-parentUserSelect"
                  component={FormikSingleSelectField}
                  disabled={disabled}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  options={operators.map(({ uuid, fullName }) => ({
                    label: fullName,
                    value: uuid,
                    disabled: selectedOperators.includes(uuid),
                  }))}
                />

                <Field
                  name={`${namePrefix}[${index}].percentage`}
                  data-testid="RuleOperatorSpreads-percentageInput"
                  type="number"
                  placeholder={index === 0 ? '100%' : '0%'}
                  disabled={disabled || !operatorSpreads[index]}
                  component={FormikInputField}
                />

                <If condition={operatorSpreads?.length !== index}>
                  <TrashButton
                    className="RuleOperatorSpreads__button"
                    data-testid="RuleOperatorSpreads-trashButton"
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
