import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import classNames from 'classnames';
import renderLabel from '../../utils/renderLabel';
import { customValueFieldTypesLabels } from '../../constants/form';

const CustomValueFieldVertical = (props, { _reduxForm: { syncErrors: errors } }) => {
  const {
    id,
    basename,
    label,
    disabled,
    valueInputClassName,
    typeInputClassName,
    typeValues,
  } = props;

  const classList = {
    formGroup: classNames('form-group', {
      'has-danger': errors[basename] && (!!errors[basename].value || !!errors[basename].type),
    }),
    valueInput: classNames('form-control', valueInputClassName, {
      'has-danger': errors[basename] && !!errors[basename].value,
    }),
    typeInput: classNames('form-control', typeInputClassName, {
      'has-danger': errors[basename] && !!errors[basename].type,
    }),
  };

  return (
    <div className={classList.formGroup}>
      <label>
        {label}
      </label>
      <div className="row">
        <div className="col-md-4">
          <Field
            id={id}
            name={`${basename}.value`}
            disabled={disabled}
            placeholder={typeof label === 'string' ? label : null}
            component="input"
            type="text"
            className={classList.valueInput}
          />
        </div>
        <div className="col-md-8">
          <Field
            name={`${basename}.type`}
            className={classList.typeInput}
            component="select"
            disabled={disabled}
          >
            {typeValues.map(key =>
              (
                <option key={key} value={key}>
                  {renderLabel(key, customValueFieldTypesLabels)}
                </option>
              )
            )}
          </Field>
        </div>
      </div>
      {!!errors[`${basename}.value`] && <div className="form-control-feedback">
        {errors[`${basename}.value`]}
      </div>}
      {!!errors[`${basename}.type`] && <div className="form-control-feedback">
        {errors[`${basename}.type`]}
      </div>}
    </div>
  );
};

CustomValueFieldVertical.defaultProps = {
  valueInputClassName: '',
  typeInputClassName: '',
  errors: {},
  disabled: false,
  id: null,
};

CustomValueFieldVertical.propTypes = {
  id: PropTypes.string,
  basename: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  typeValues: PropTypes.array.isRequired,
  valueInputClassName: PropTypes.string,
  typeInputClassName: PropTypes.string,
  disabled: PropTypes.bool,
};

CustomValueFieldVertical.contextTypes = {
  _reduxForm: PropTypes.object,
};

export default CustomValueFieldVertical;
