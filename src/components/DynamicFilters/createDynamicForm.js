import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { v4 } from 'uuid';
import { I18n } from 'react-redux-i18n';
import FilterItem from './FilterItem';
import FilterField from './FilterField';
import { InputField, SelectField, DateTimeField, NasSelectField, RangeGroup } from '../ReduxForm';
import { TYPES } from './constants';
import AvailableFiltersSelect from './FiltersSelect';
import { actionCreators } from './reduxModule';

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
      .map(this.mapFilter);
    const currentFilters = filters
      .filter(filter => filter.default || props.selectedFilters.indexOf(filter.name) > -1)
      .sort((a, b) => {
        if (a.default && b.default) {
          return 0;
        } else if (a.default && !b.default) {
          return -1;
        } else if (!a.default && b.default) {
          return 1;
        }

        const aIndex = props.selectedFilters.indexOf(a.name);
        const bIndex = props.selectedFilters.indexOf(b.name);

        return aIndex < bIndex ? -1 : 1;
      });

    this.state = {
      filters,
      currentFilters,
      availableFilters: filters.filter(filter => currentFilters.findIndex(f => f.uuid === filter.uuid) === -1),
      data: {},
    };
  }

  mapFilter = (element) => {
    const { label, size, type, placeholder, children } = element.props;
    const childrenList = React.Children
      .toArray(children)
      .filter(child => child.type === FilterField);

    const filter = {
      uuid: v4(),
      label,
      size,
      type,
      placeholder,
      default: element.props.default,
      inputs: childrenList.map(child => ({ ...child.props, key: child.props.name })),
    };
    filter.name = filter.inputs.reduce((res, input) => [res, input.name].filter(n => n).join('/'), null);

    return filter;
  };

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

  renderFilter = (filter) => {
    let input;
    const { className } = this.props;
    const removeButton = filter.default ? null : (
      <button
        className="icon icon-times label-clear"
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
          placeholder={filter.placeholder}
          {...filter.inputs[0]}
          labelAddon={removeButton}
        />
      );
    } else {
      const [from, to] = filter.inputs;
      const [fromPl, toPl] = filter.placeholder ? filter.placeholder.split('/') : [];

      if (filter.type === TYPES.range_input) {
        input = [
          <Field component="input" className="form-control" placeholder={fromPl} {...from} />,
          <Field component="input" className="form-control" placeholder={toPl} {...to} />,
        ];
      } else if (filter.type === TYPES.range_date) {
        input = [
          <Field component={DateTimeField} pickerClassName="left-side" placeholder={fromPl} {...from} />,
          <Field component={DateTimeField} placeholder={toPl} {...to} />,
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
