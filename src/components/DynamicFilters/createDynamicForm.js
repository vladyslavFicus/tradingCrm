import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { v4 } from 'uuid';
import { I18n } from 'react-redux-i18n';
import FilterItem from './FilterItem';
import FilterField from './FilterField';
import { InputField, SelectField, DateTimeField, NasSelectField } from '../ReduxForm';
import { TYPES } from './constants';
import AvailableFiltersSelect from './FiltersSelect';

const TYPES_COMPONENTS = {
  [TYPES.input]: InputField,
  [TYPES.select]: SelectField,
  [TYPES.nas_select]: NasSelectField,
  [TYPES.range_input]: InputField,
  [TYPES.range_date]: DateTimeField,
  [TYPES.range_datetime]: DateTimeField,
};

class DynamicFilters extends Component {
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

    const children = React.Children
      .toArray(props.children);
    const filters = children
      .filter(child => child.type === FilterItem)
      .map(this.mapFilter);

    this.state = {
      filters,
      currentFilters: filters.filter(filter => filter.default),
      availableFilters: filters.filter(filter => !filter.default),
      data: {},
    };
  }

  mapFilter = (element) => {
    const { label, size, type, children } = element.props;
    const childrenList = React.Children
      .toArray(children)
      .filter(child => child.type === FilterField);

    return {
      uuid: v4(),
      label,
      size,
      type,
      default: element.props.default,
      inputs: childrenList.map(child => ({ ...child.props })),
    };
  };

  handleAddFilter = (uuid) => {
    const { filters, currentFilters } = this.state;
    const nextCurrentFilters = [...currentFilters];
    const newFilter = filters.find(filter => filter.uuid === uuid);

    if (newFilter) {
      nextCurrentFilters.push(newFilter);
    }

    this.setState({
      currentFilters: nextCurrentFilters,
      availableFilters: filters.filter(filter => nextCurrentFilters.findIndex(f => f.uuid === filter.uuid) === -1),
    });
  };

  handleRemoveFilter = (uuid) => {
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
    this.props.onReset();
  };

  renderFilter = (filter) => {
    let input;
    const { className } = this.props;
    const removeButton = filter.default ? null : (
      <button
        className="nas nas-clear_icon label-clear"
        onClick={() => this.handleRemoveFilter(filter.uuid)}
        type="button"
      />
    );
    const component = TYPES_COMPONENTS[filter.type];
    const isSimpleInput = [TYPES.input, TYPES.select, TYPES.nas_select].indexOf(filter.type) > -1;

    if (isSimpleInput) {
      input = (
        <Field
          label={filter.label}
          component={component}
          position="vertical"
          {...filter.inputs[0]}
          labelAddon={removeButton}
        />
      );
    } else if (filter.type === TYPES.range_input) {
      const [from, to] = filter.inputs;

      input = (
        <div className="form-group">
          <div>
            <label>{filter.label}</label>
            {removeButton}
          </div>
          <div className="range-group">
            <Field
              component="input"
              className="form-control"
              {...from}
            />
            <span className="range-group__separator">-</span>
            <Field
              component="input"
              className="form-control"
              {...to}
            />
          </div>
        </div>
      );
    } else if (filter.type === TYPES.range_date) {
      const [from, to] = filter.inputs;

      input = (
        <div className="form-group">
          <div>
            <label>{filter.label}</label>
            {removeButton}
          </div>
          <div className="range-group">
            <Field
              component={DateTimeField}
              position="vertical"
              {...from}
            />
            <span className="range-group__separator">-</span>
            <Field
              component={DateTimeField}
              position="vertical"
              {...to}
            />
          </div>
        </div>
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
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div className={className}>
          {currentFilters.map(this.renderFilter)}

          <div className={`${className}__button-block`}>
            <div className="button-block-container">
              {
                availableFilters.length > 0 &&
                <AvailableFiltersSelect
                  onChange={this.handleAddFilter}
                  options={availableFilters}
                />
              }
              <button
                disabled={submitting || (allowReset && pristine)}
                className="btn btn-default"
                onClick={this.handleReset}
                type="reset"
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
        </div>
      </form>
    );
  }
}

export default options => reduxForm(options)(DynamicFilters);
