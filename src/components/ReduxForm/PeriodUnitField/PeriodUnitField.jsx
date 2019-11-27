import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { intNormalize } from '../../../utils/inputNormalize';
import InputField from '../InputField';
import SelectField from '../SelectField';

const PeriodUnitField = (props) => {
  const {
    label,
    disabled,
    id,
    children,
    className,
    input: { name },
    meta: { touched, error },
    showErrorMessage,
  } = props;

  const groupClassName = classNames('form-group', className, { 'has-danger': touched && error });

  return (
    <div className={groupClassName}>
      <label>{label}</label>
      <div className="form-row">
        <Field
          name={name}
          id={id}
          type="number"
          placeholder=""
          disabled={disabled}
          component={InputField}
          showErrorMessage={false}
          normalize={intNormalize}
          className="col-6 mb-0"
        />
        <Field
          name={`${name}TimeUnit`}
          id={id ? `${id}-time-unit` : null}
          type="select"
          component={SelectField}
          disabled={disabled}
          className="col mb-0"
        >
          <option value="">
            {I18n.t('CAMPAIGNS.SETTINGS.SELECT_PERIOD')}
          </option>
          {children}
        </Field>
      </div>
      <If condition={showErrorMessage && touched && error}>
        <div className="form-row">
          <If condition={showErrorMessage && touched && error}>
            <div className="col form-control-feedback">
              <i className="icon icon-alert" />
              {error}
            </div>
          </If>
        </div>
      </If>
    </div>
  );
};

PeriodUnitField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }).isRequired,
  showErrorMessage: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
PeriodUnitField.defaultProps = {
  id: null,
  className: null,
  showErrorMessage: true,
  disabled: false,
  label: null,
};

export default PeriodUnitField;
