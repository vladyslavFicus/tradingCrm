import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, FieldArray } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { Button } from 'components/UI';
import { isSales } from 'constants/hierarchyTypes';
import { attributeLabels } from '../../constants';

class RuleOperatorSpreads extends PureComponent {
  static propTypes = {
    operators: PropTypes.array.isRequired,
    operatorSpreads: PropTypes.array.isRequired,
    selectedOperators: PropTypes.array.isRequired,
    setSelectedOperators: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    percentageLimitError: PropTypes.bool,
  }

  static defaultProps = {
    percentageLimitError: false,
  }

  handleSelectOperator = (index, name, value, arrayHelpers) => {
    const {
      setFieldValue,
      selectedOperators,
      setSelectedOperators,
    } = this.props;

    setSelectedOperators([...selectedOperators, value]);

    arrayHelpers.insert(index, '');

    setFieldValue(name, value);
  };

  render() {
    const {
      operators,
      operatorSpreads,
      selectedOperators, // ?
      setSelectedOperators, // ?
      isSubmitting,
      percentageLimitError,
    } = this.props;

    return (
      <div className="row">
        <FieldArray
          name="operatorSpreads"
          render={arrayHelpers => (
            <Fragment>
              {operatorSpreads.map(({ parentUser }, index) => (
                <Fragment key={index}>
                  <Field
                    name={`operatorSpreads[${index}].parentUser`}
                    label={index === 0 ? I18n.t(attributeLabels.operator) : ''}
                    component={FormikSelectField}
                    customOnChange={value => this.handleSelectOperator(
                      index,
                      `operatorSpreads[${index}].parentUser`,
                      value,
                      arrayHelpers,
                    )}
                    className="col-7"
                    disabled={isSubmitting}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    searchable
                  >
                    {operators
                      .filter(({ hierarchy: { userType } }) => isSales(userType))
                      .map(({ uuid, fullName }) => (
                        <option
                          key={uuid}
                          value={uuid}
                          disabled={selectedOperators.indexOf(uuid) !== -1}
                        >
                          {fullName}
                        </option>
                      ))
                    }
                  </Field>
                  <Field
                    name={`operatorSpreads[${index}].percentage`}
                    type="number"
                    placeholder={index === 0 ? '100%' : '0%'}
                    label={index === 0 ? I18n.t(attributeLabels.ratio) : ''}
                    disabled={isSubmitting || !operatorSpreads[index]}
                    component={FormikInputField}
                    className={
                      classNames('col-4', {
                        'input--has-error': percentageLimitError,
                      })
                    }
                  />
                  <If condition={selectedOperators.length > 0 && selectedOperators.length !== index}>
                    <Button
                      transparent
                      className="RuleSettings__button"
                      onClick={() => {
                        const newSelectedOperators = [...selectedOperators];
                        newSelectedOperators.splice(newSelectedOperators.indexOf(parentUser), 1);
                        setSelectedOperators(newSelectedOperators);

                        arrayHelpers.remove(index);
                      }}
                    >
                      <i className="fa fa-trash btn-transparent color-danger" />
                    </Button>
                  </If>
                </Fragment>
              ))}
            </Fragment>
          )}
        />
        <If condition={percentageLimitError}>
          <div className="RuleSettings__percentage-error color-danger">
            <div className="col-7">
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.PERCENTAGE_LIMIT_ERROR')}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default RuleOperatorSpreads;
