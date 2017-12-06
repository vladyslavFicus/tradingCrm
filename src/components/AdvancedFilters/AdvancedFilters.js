import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { v4 } from 'uuid';
import FilterItem from './FilterItem';
import FilterField from './FilterField';
import FilterActions from './FilterActions';
import { InputField, SelectField, DateTimeField, NasSelectField } from '../ReduxForm';
import { TYPES } from './constants';
import AvailableFiltersSelect from './FiltersSelect';
import shallowEqual from '../../utils/shallowEqual';

const TYPES_COMPONENTS = {
  [TYPES.input]: InputField,
  [TYPES.select]: SelectField,
  [TYPES.nas_select]: NasSelectField,
  [TYPES.range_input]: InputField,
  [TYPES.range_date]: DateTimeField,
  [TYPES.range_datetime]: DateTimeField,
};

class AdvancedFilters extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: 'filter-row',
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
      actions: children.filter(child => child.type === FilterActions),
    };
  }

  componentWillReceiveProps({ children: nextChildren }) {
    const { children } = this.props;

    if (!shallowEqual(children, nextChildren)) {
      const actions = React.Children
        .toArray(nextChildren)
        .filter(child => child.type === FilterActions);

      this.setState({ actions });
    }
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
    const { filters, currentFilters } = this.state;

    const index = currentFilters.findIndex(filter => filter.uuid === uuid);
    if (index > -1) {
      const nextCurrentFilters = [...currentFilters];
      nextCurrentFilters.splice(index, 1);

      this.setState({
        currentFilters: nextCurrentFilters,
        availableFilters: filters.filter(filter => nextCurrentFilters.findIndex(f => f.uuid === filter.uuid) === -1),
      });
    }
  };

  renderFilter = (filter) => {
    let input;
    const removeButton = filter.default ? null : (
      <button
        className="nas nas-clear_icon label-clear"
        onClick={() => this.handleRemoveFilter(filter.uuid)}
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
          <label>{filter.label} {removeButton}</label>
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
          <label>{filter.label} {removeButton}</label>
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
      <div className={`filter-row__${filter.size}`} key={filter.label}>
        {input}
      </div>
    );
  };

  render() {
    const { className, onSubmit } = this.props;
    const { currentFilters, availableFilters, actions } = this.state;

    return (
      <form onSubmit={onSubmit}>
        <div className={className}>
          {currentFilters.map(this.renderFilter)}

          {
            availableFilters.length > 0 &&
            <AvailableFiltersSelect
              onChange={this.handleAddFilter}
              options={availableFilters}
            />
          }

          {
            actions &&
            <div className="filter-row__button-block">
              {actions}
            </div>
          }
        </div>
      </form>
    );
  }
}

export default AdvancedFilters;
