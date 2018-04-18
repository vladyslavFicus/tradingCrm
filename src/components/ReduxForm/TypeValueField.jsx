import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
  const valueField = get(props, `${name}.value`);

  return (
    <div className="row no-gutters">
      <div className="col-4 pr-2">
        <Choose>
          <When condition={typeField.input.value !== customValueFieldTypes.ABSOLUTE}>
            <Field
              id={`${id}Value`}
              name={`${name}.percentage`}
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
              baseName={valueField.input.name}
              label=""
              showErrorMessage={false}
              placeholder={typeof label === 'string' ? label : null}
            />
          </Otherwise>
        </Choose>
      </div>
      <div className="col">
        <Field
          id={`${id}Type`}
          name={typeField.input.name}
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
    ...rest
  } = props;

  return (
    <div className="form-group">
      <label>{rest.label}</label>
      <Fields names={[`${name}.value`, `${name}.type`]} component={renderFields} name={name} {...rest} />
    </div>
  );
};

TypeValueField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default TypeValueField;
