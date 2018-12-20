import React, { Component, Fragment } from 'react';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';
import { RangeGroup } from '../../components/ReduxForm';
import { createValidator } from '../../utils/validator';
import { fieldTypes, components, validators, getValidationRules } from './constants';

class ListFilters extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    invalid: PropTypes.bool,
    change: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
  };

  static defaultProps = {
    invalid: true,
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    currentValues: null,
  };

  startDateValidator = fieldName => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fieldName]
      ? current.isSameOrBefore(moment(currentValues[fieldName]))
      : current.isSameOrBefore(moment());
  };

  endDateValidator = fieldName => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fieldName]
      ? current.isSameOrAfter(moment(currentValues[fieldName]))
      : true;
  };

  handleSelectFieldChange = fieldName => (value) => {
    const { change } = this.props;

    this.props.onFieldChange(fieldName, value, change);
  }

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  renderFilterFields = fields => (!Array.isArray(fields)
    ? null
    : fields
      .map(({
        id,
        type,
        name,
        label,
        className,
        placeholder,
        disabled,
        // input props
        inputType,
        inputAddon,
        normalize,
        // select props
        multiple,
        withAnyOption,
        selectOptions,
        onFieldChange,
        // date props
        dateValidator,
        pickerClassName,
        closeOnSelect,
        // rangeProps
        fields: rangeFields,
      }) => {
        const commonProps = {
          name,
          ...label && { label },
          ...className && { className },
          ...placeholder && { placeholder },
          ...disabled && { disabled },
        };
        let filter = null;

        switch (type) {
          case (fieldTypes.INPUT): {
            filter = (
              <Field
                {...commonProps}
                id={id}
                type={inputType || 'text'}
                component={components.INPUT}
                {...inputAddon && { inputAddon }}
                {...normalize && { normalize }}
              />
            );

            break;
          }

          case (fieldTypes.SELECT): {
            filter = (
              <Field
                {...commonProps}
                component={components.SELECT}
                multiple={multiple}
                {...onFieldChange && { onFieldChange: this.handleSelectFieldChange(name) }}
                {...withAnyOption
                  ? { withAnyOption }
                  : (!multiple && { withAnyOption: true })
                }
              >
                {selectOptions.map(({ value, label: optionLabel }) => (
                  <option key={value} value={value}>
                    {I18n.t(optionLabel)}
                  </option>
                ))}
              </Field>
            );

            break;
          }

          case (fieldTypes.DATE): {
            let isValidDate = null;

            if (dateValidator.type === validators.START_DATE) {
              isValidDate = this.startDateValidator(dateValidator.fieldName);
            }

            if (dateValidator.type === validators.END_DATE) {
              isValidDate = this.endDateValidator(dateValidator.fieldName);
            }
            filter = (
              <Field
                {...commonProps}
                utc
                component={components.DATE}
                {...(typeof closeOnSelect === 'boolean') && { closeOnSelect }}
                {...dateValidator && { isValidDate }}
                {...pickerClassName && { pickerClassName }}
              />
            );

            break;
          }

          case (fieldTypes.RANGE): {
            filter = (
              <RangeGroup
                label={label}
                {...className && { className }}
              >
                {this.renderFilterFields(rangeFields)}
              </RangeGroup>
            );

            break;
          }

          default: break;
        }

        return (
          <Fragment key={name || label}>
            {filter}
          </Fragment>
        );
      })
      .filter(item => item)
  );

  render() {
    const {
      submitting,
      pristine,
      handleSubmit,
      onSubmit,
      invalid,
      fields,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        {this.renderFilterFields(fields)}
        <div className="filter-row__button-block">
          <button
            disabled={submitting || pristine}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || pristine || invalid}
            className="btn btn-primary"
            type="submit"
            id="transactions-list-filters-apply-button"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

const FORM_NAME = `listFiltersFrom-${Math.random().toString(36).slice(8)}`;

const ListFilterForm = reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (values, { fields }) => createValidator(getValidationRules(fields), false)(values),
})(ListFilters);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(ListFilterForm);
