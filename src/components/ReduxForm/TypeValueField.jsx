import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import classNames from 'classnames';
import { Field, Fields } from 'redux-form';
import renderLabel from '../../utils/renderLabel';
import { InputField, SelectField, MultiCurrencyValue } from '../../components/ReduxForm';
import { customValueFieldTypesLabels, customValueFieldTypes } from '../../constants/form';

const renderFields = ({
  disabled,
  typeValues,
  children,
  id,
  label,
  name,
  valueFieldProps,
  ...props
}) => {
  const typeField = get(props, `${name}.type`);

  return (
    <div className="row no-gutters">
      <Choose>
        <When condition={typeField.input.value !== customValueFieldTypes.ABSOLUTE}>
          <Field
            name={`${name}.percentage`}
            showErrorMessage={false}
            disabled={disabled}
            placeholder={typeof label === 'string' ? label : null}
            component={InputField}
            type="text"
            position="vertical"
            className="col-4 pr-2"
            id={`${id}-percentage-amount`}
            {...valueFieldProps}
          />
        </When>
        <Otherwise>
          <MultiCurrencyValue
            baseName={`${name}.absolute`}
            showErrorMessage={false}
            placeholder={typeof label === 'string' ? label : null}
            className="col-4 pr-2"
            id={`${id}-absolute-amount`}
          />
        </Otherwise>
      </Choose>
      <Field
        name={typeField.input.name}
        showErrorMessage={false}
        component={SelectField}
        disabled={disabled}
        position="vertical"
        className="col"
        id={`${id}-type`}
      >
        {children || typeValues.map(key => (
          <option key={key} value={key}>
            {renderLabel(key, customValueFieldTypesLabels)}
          </option>
        ))}
      </Field>
    </div>
  );
};

renderFields.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  typeValues: PropTypes.array,
  valueInputClassName: PropTypes.string,
  typeInputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  valueFieldProps: PropTypes.object,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.object,
  }),
  children: PropTypes.node,
};

renderFields.defaultProps = {
  valueInputClassName: '',
  typeInputClassName: '',
  disabled: false,
  id: null,
  meta: {},
  typeValues: Object.keys(customValueFieldTypes),
  valueFieldProps: {},
  children: null,
};

const TypeValueField = (props) => {
  const {
    input: { name },
    className,
    ...rest
  } = props;

  return (
    <div className={classNames('form-group mb-0', className)}>
      <label>{rest.label}</label>
      <Fields names={[`${name}.value`, `${name}.type`]} component={renderFields} name={name} {...rest} />
    </div>
  );
};

TypeValueField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};
TypeValueField.defaultProps = {
  className: null,
};

export default TypeValueField;
