import React from 'react';
import PropTypes from 'prop-types';
import { Field, FormSection, Fields } from 'redux-form';
import renderLabel from '../../utils/renderLabel';
import { InputField, SelectField, MultiCurrencyValue } from '../../components/ReduxForm';
import { customValueFieldTypesLabels, customValueFieldTypes } from '../../constants/form';

const renderFields = ({
  disabled,
  typeValues,
  children,
  id,
  label,
  type,
  valueFieldProps,
}) => (
  <div className="row no-gutters">
    <div className="col-4 pr-2">
      <Choose>
        <When condition={type.input.value !== customValueFieldTypes.ABSOLUTE}>
          <Field
            id={`${id}Value`}
            name="value"
            showErrorMessage={false}
            disabled={disabled}
            placeholder={typeof label === 'string' ? label : null}
            component={InputField}
            type="text"
            position="vertical"
            {...valueFieldProps}
          />
        </When>
        <Otherwise>
          <MultiCurrencyValue
            name="value"
            label=""
            placeholder={typeof label === 'string' ? label : null}
          />
        </Otherwise>
      </Choose>
    </div>
    <div className="col">
      <Field
        id={`${id}Type`}
        name="type"
        className="form-control"
        showErrorMessage={false}
        component={SelectField}
        disabled={disabled}
        position="vertical"
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
);

const CustomValueFieldVertical = (props) => {
  const {
    input: { name },
    meta: { touched, error },
    ...rest
  } = props;

  return (
    <FormSection name={name} className="form-group">
      <label>{rest.label}</label>
      <Fields names={['value', 'type']} component={renderFields} {...rest} />
      <If condition={touched && error && error.value}>
        <div className="form-control-feedback">
          {error.value}
        </div>
      </If>
      <If condition={touched && error && error.type}>
        <div className="form-control-feedback">
          {error.type}
        </div>
      </If>
    </FormSection>
  );
};

CustomValueFieldVertical.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  typeValues: PropTypes.array,
  valueInputClassName: PropTypes.string,
  typeInputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  valueFieldProps: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.object,
  }),
  children: PropTypes.node,
};
CustomValueFieldVertical.defaultProps = {
  valueInputClassName: '',
  typeInputClassName: '',
  disabled: false,
  id: null,
  meta: {},
  typeValues: Object.keys(customValueFieldTypes),
  valueFieldProps: {},
  children: null,
};

export default CustomValueFieldVertical;
