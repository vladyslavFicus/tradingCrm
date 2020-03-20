import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import classNames from 'classnames';
import { Field, Fields } from 'redux-form';
import { withReduxFormValues } from 'hoc';
import { InputField, SelectField, MultiCurrencyValue } from 'components/ReduxForm';
import renderLabel from '../../utils/renderLabel';
import { customValueFieldTypesLabels, customValueFieldTypes } from '../../constants/form';

class renderFields extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    typeValues: PropTypes.array,
    valueInputClassName: PropTypes.string,
    typeInputClassName: PropTypes.string,
    disabled: PropTypes.bool,
    formValues: PropTypes.object.isRequired,
    valueFieldProps: PropTypes.object,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.object,
    }),
    children: PropTypes.node,
  };

  static defaultProps = {
    valueInputClassName: '',
    typeInputClassName: '',
    disabled: false,
    id: null,
    meta: {},
    typeValues: Object.keys(customValueFieldTypes),
    valueFieldProps: {},
    children: null,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  setField = (field, value = '') => this.context._reduxForm.autofill(field, value);

  handleChangeType = (e) => {
    const { formValues, name } = this.props;

    if (e.target.value === customValueFieldTypes.ABSOLUTE) {
      this.setField(`${name}.absolute`, [{ amount: get(formValues, `${name}.percentage`, 0) }]);
    }

    if (e.target.value === customValueFieldTypes.PERCENTAGE) {
      this.setField(`${name}.percentage`, get(formValues, `${name}.absolute[0].amount`));
    }
  };

  render() {
    const {
      disabled,
      typeValues,
      children,
      id,
      label,
      name,
      valueFieldProps, ...props
    } = this.props;
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
          onChange={this.handleChangeType}
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
  }
}

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

export default withReduxFormValues(TypeValueField);
