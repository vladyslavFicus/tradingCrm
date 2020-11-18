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
    isSubmitting: PropTypes.bool.isRequired,
    percentageLimitError: PropTypes.bool,
  }

  static defaultProps = {
    percentageLimitError: false,
  }

  render() {
    const {
      operators,
      operatorSpreads,
      isSubmitting,
      percentageLimitError,
    } = this.props;

    const selectedOperators = operatorSpreads.map(({ parentUser }) => parentUser);

    return (
      <div className="row">
        <FieldArray
          name="operatorSpreads"
          render={arrayHelpers => (
            <Fragment>
              {[...operatorSpreads, ''].map((_, index) => (
                <Fragment key={index}>
                  <Field
                    name={`operatorSpreads[${index}].parentUser`}
                    label={index === 0 ? I18n.t(attributeLabels.operator) : ''}
                    component={FormikSelectField}
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
                          disabled={selectedOperators.includes(uuid)}
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
                  <If condition={operatorSpreads.length && operatorSpreads.length !== index}>
                    <Button
                      transparent
                      className="RuleSettings__button"
                      onClick={() => arrayHelpers.remove(index)}
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
