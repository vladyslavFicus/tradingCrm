import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, FieldArray } from 'formik';
import PropTypes from 'constants/propTypes';
import { attributeLabels } from 'constants/ruleModal';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { TrashButton } from 'components/UI';
import './RuleOperatorSpreads.scss';

/**
 * This is reused part of outer Formik form.
 * It may lay in a different level of fields nesting,
 * so it's important to have namePrefix param to provide right fields path for Formik search engine
 */
class RuleOperatorSpreads extends PureComponent {
  static propTypes = {
    operators: PropTypes.arrayOf(PropTypes.operatorsListEntity).isRequired,
    operatorSpreads: PropTypes.array.isRequired,
    removeOperatorSpread: PropTypes.func.isRequired,
    namePrefix: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    percentageLimitError: PropTypes.bool,
  }

  static defaultProps = {
    percentageLimitError: false,
  }

  render() {
    const {
      operators,
      operatorSpreads,
      removeOperatorSpread,
      namePrefix,
      disabled,
      percentageLimitError,
    } = this.props;

    const selectedOperators = operatorSpreads.map(({ parentUser }) => parentUser);

    return (
      <div className="row">
        <FieldArray
          name={namePrefix}
          render={() => (
            <Fragment>
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
                    className={
                      classNames({
                        'input--has-error': percentageLimitError,
                      })
                    }
                  />
                  <If condition={operatorSpreads.length && operatorSpreads.length !== index}>
                    <TrashButton
                      className="RuleOperatorSpreads__button"
                      onClick={() => removeOperatorSpread(index)}
                    />
                  </If>
                </div>
              ))}
            </Fragment>
          )}
        />
        <If condition={percentageLimitError}>
          <div className="RuleOperatorSpreads__percentage-error">
            {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.PERCENTAGE_LIMIT_ERROR')}
          </div>
        </If>
      </div>
    );
  }
}

export default RuleOperatorSpreads;
