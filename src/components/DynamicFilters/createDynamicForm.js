import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n';
import FilterItem from './FilterItem';
import { InputField, SelectField, DateTimeField, NasSelectField, RangeGroup } from '../ReduxForm';
import { TYPES } from './constants';
import AvailableFiltersSelect from './FiltersSelect';
import { actionCreators } from './reduxModule';
import { mapFilter, getCurrentFilters } from './utils';

const TYPES_COMPONENTS = {
  [TYPES.input]: InputField,
  [TYPES.select]: SelectField,
  [TYPES.nas_select]: NasSelectField,
  [TYPES.range_input]: InputField,
  [TYPES.range_date]: DateTimeField,
};

class DynamicForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    allowSubmit: PropTypes.bool,
    allowReset: PropTypes.bool,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    invalid: PropTypes.bool.isRequired,
    formName: PropTypes.string.isRequired,
    selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: 'filter-row',
    allowSubmit: false,
    allowReset: false,
    submitting: false,
    pristine: false,
    handleSubmit: null,
    reset: null,
  };

  constructor(props) {
    super(props);

    const children = React.Children.toArray(props.children);
    const filters = children
      .filter(child => child.type === FilterItem)
      .map(mapFilter);
    const currentFilters = getCurrentFilters(filters, props);

    this.state = {
      filters,
      currentFilters,
      availableFilters: filters.filter(filter => currentFilters.findIndex(f => f.uuid === filter.uuid) === -1),
      data: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const children = React.Children.toArray(nextProps.children);
    const filters = children
      .filter(child => child.type === FilterItem)
      .map(mapFilter);

    const indexesToUpdate = [];
    filters.forEach((item, index) => {
      if (!isEqual(item.inputs, prevState.filters[index].inputs)
          || item.disabled !== prevState.filters[index].disabled) {
        indexesToUpdate.push(index);
      }
    });

    if (indexesToUpdate.length > 0) {
      const currentFilters = prevState.currentFilters
        .map((item, index) => ((indexesToUpdate.indexOf(index) > -1)
          ? filters[index]
          : item
        ));

      return { filters, currentFilters };
    }

    return null;
  }

  handleAddFilter = (uuid) => {
    const { addItem, formName } = this.props;
    const { filters, currentFilters } = this.state;
    const nextCurrentFilters = [...currentFilters];
    const newFilter = filters.find(filter => filter.uuid === uuid);

    if (newFilter) {
      nextCurrentFilters.push(newFilter);
    }

    this.setState({
      currentFilters: nextCurrentFilters,
      availableFilters: filters.filter(filter => nextCurrentFilters.findIndex(f => f.uuid === filter.uuid) === -1),
    }, () => {
      addItem(formName, newFilter.name);
    });
  };

  handleRemoveFilter = (uuid) => {
    const { removeItem, formName } = this.props;
    const { filters, currentFilters, data } = this.state;

    const index = currentFilters.findIndex(filter => filter.uuid === uuid);
    if (index > -1) {
      const nextCurrentFilters = [...currentFilters];
      nextCurrentFilters.splice(index, 1);

      this.setState({
        currentFilters: nextCurrentFilters,
        availableFilters: filters.filter(filter => nextCurrentFilters.findIndex(f => f.uuid === filter.uuid) === -1),
      }, () => {
        const nextData = { ...data };
        currentFilters[index].inputs.forEach((input) => {
          delete nextData[input.name];
        });
        removeItem(formName, currentFilters[index].name);

        if (Object.keys(nextData).length > 0) {
          this.handleSubmit(nextData);
        } else {
          this.handleReset();
        }
      });
    }
  };

  handleSubmit = (data) => {
    this.setState({ data: { ...data } });
    return this.props.onSubmit(data);
  };

  handleReset = () => {
    this.props.reset();

    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  handleFilterValueChange = ({ name, onFieldChange }) => (value) => {
    const { change } = this.props;
    onFieldChange(name, value, change);
  };

  renderFilter = (filter) => {
    let input;
    const { className } = this.props;
    const removeButton = (
      <If condition={!filter.default}>
        <button
          className="icon icon-times label-clear"
          onClick={() => this.handleRemoveFilter(filter.uuid)}
          type="button"
        />
      </If>
    );

    const component = TYPES_COMPONENTS[filter.type];
    const isSimpleInput = [TYPES.input, TYPES.select, TYPES.nas_select].indexOf(filter.type) > -1;

    if (isSimpleInput) {
      input = (
        <Field
          label={filter.label}
          component={component}
          position="vertical"
          disabled={filter.disabled}
          placeholder={filter.placeholder}
          {...(filter.onFieldChange && { onFieldChange: this.handleFilterValueChange(filter) })}
          {...filter.inputs[0]}
          labelAddon={removeButton}
        />
      );
    } else {
      const [from, to] = filter.inputs;
      const [fromPl, toPl] = filter.placeholder ? filter.placeholder.split('/') : [];

      if (filter.type === TYPES.range_input) {
        input = [
          <Field
            component="input"
            className="form-control"
            placeholder={fromPl}
            disabled={filter.disabled}
            {...from}
          />,
          <Field
            component="input"
            className="form-control"
            placeholder={toPl}
            disabled={filter.disabled}
            {...to}
          />,
        ];
      } else if (filter.type === TYPES.range_date) {
        input = [
          <Field
            component={DateTimeField}
            pickerClassName="left-side"
            placeholder={fromPl}
            disabled={filter.disabled}
            {...from}
          />,
          <Field component={DateTimeField} placeholder={toPl} isDateRangeEndValue {...to} />,
        ];
      }

      input = (
        <RangeGroup label={filter.label} labelAddon={removeButton}>
          {input}
        </RangeGroup>
      );
    }

    return (
      <div className={`${className}__${filter.size}`} key={filter.label}>
        {input}
      </div>
    );
  };

  render() {
    const {
      className,
      allowSubmit,
      allowReset,
      submitting,
      pristine,
      handleSubmit,
      invalid,
    } = this.props;
    const { currentFilters, availableFilters } = this.state;

    return (
      <form className={className} onSubmit={handleSubmit(this.handleSubmit)}>
        {currentFilters.map(this.renderFilter)}

        <div className={`${className}__button-block`}>
          <div className="button-block-container">
            <AvailableFiltersSelect
              onChange={this.handleAddFilter}
              options={availableFilters}
            />
            <button
              disabled={submitting || (allowReset && pristine)}
              className="btn btn-default"
              onClick={this.handleReset}
              type="button"
            >
              {I18n.t('COMMON.RESET')}
            </button>
            <button
              id="users-list-apply-button"
              disabled={submitting || (allowSubmit && pristine) || invalid}
              className="btn btn-primary"
              type="submit"
            >
              {I18n.t('COMMON.APPLY')}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default (options) => {
  const Form = reduxForm(options)(DynamicForm);

  return connect(state => ({
    formName: options.form,
    selectedFilters: state.dynamicFilters && state.dynamicFilters[options.form]
      ? state.dynamicFilters[options.form]
      : [],
  }), {
    addItem: actionCreators.addItem,
    removeItem: actionCreators.removeItem,
  })(Form);
};
