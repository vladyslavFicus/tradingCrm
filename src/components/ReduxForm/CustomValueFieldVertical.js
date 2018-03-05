import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { get } from 'lodash';
import renderLabel from '../../utils/renderLabel';
import { customValueFieldTypesLabels } from '../../constants/form';

const CustomValueFieldVertical = (props, { _reduxForm: { syncErrors: errors, meta } }) => {
  const {
    id,
    basename,
    label,
    disabled,
    valueInputClassName,
    typeInputClassName,
    typeValues,
    children,
    valueFieldProps,
  } = props;

  const typeError = get(errors, `${basename}.type`) && get(meta, `${basename}.type.touched`);
  const valueError = get(errors, `${basename}.value`) && get(meta, `${basename}.value.touched`);

  const classList = {
    formGroup: classNames('form-group', {
      'has-danger': !!valueError || !!typeError,
    }),
    valueInput: classNames('form-control', valueInputClassName, {
      'has-danger': !!valueError,
    }),
    typeInput: classNames('form-control', typeInputClassName, {
      'has-danger': !!typeError,
    }),
  };

  return (
    <div className={classList.formGroup}>
      <label>
        {label}
      </label>
      <div className="form-row">
        <div className="col-4">
          <Field
            id={`${id}Value`}
            name={`${basename}.value`}
            disabled={disabled}
            placeholder={typeof label === 'string' ? label : null}
            component="input"
            type="text"
            className={classList.valueInput}
            {...valueFieldProps}
          />
        </div>
        <div className="col">
          <Field
            id={`${id}Type`}
            name={`${basename}.type`}
            className={classList.typeInput}
            component="select"
            disabled={disabled}
          >
            {
              children ||
                typeValues.map(key =>
                  (
                    <option key={key} value={key}>
                      {renderLabel(key, customValueFieldTypesLabels)}
                    </option>
                  )
                )
            }
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

CustomValueFieldVertical.propTypes = {
  id: PropTypes.string,
  basename: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  typeValues: PropTypes.array,
  valueInputClassName: PropTypes.string,
  typeInputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  valueFieldProps: PropTypes.object,
  children: PropTypes.node,
};

CustomValueFieldVertical.defaultProps = {
  valueInputClassName: '',
  typeInputClassName: '',
  errors: {},
  disabled: false,
  id: null,
  typeValues: {},
  valueFieldProps: {},
  children: null,
};

CustomValueFieldVertical.contextTypes = {
  _reduxForm: PropTypes.object,
};

export default CustomValueFieldVertical;
