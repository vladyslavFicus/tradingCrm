import React, { Component } from 'react';
import { includes, difference } from 'lodash';
import { components } from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import './MultiInput.scss';

const getValues = value => (Array.isArray(value) ? value.map(v => v.value) : []);
const getLabels = value => (Array.isArray(value) ? value.map(v => v.label) : []);

class MultiInput extends Component {
  static propTypes = {
    async: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onAdd: PropTypes.func,
    loadOptions: PropTypes.func,
    initialValues: PropTypes.array,
    className: PropTypes.string,
    maxLength: PropTypes.number,
  };

  static defaultProps = {
    async: false,
    placeholder: '',
    disabled: false,
    onChange: null,
    maxLength: null,
    onRemove: null,
    onAdd: null,
    initialValues: [],
    loadOptions: null,
    className: null,
  };

  state = {
    inputValue: '',
    value: this.props.initialValues,
  };

  static getDerivedStateFromProps({ initialValues }, { value }) {
    if (difference(initialValues, value).length) {
      return {
        value: initialValues,
      };
    }

    return null;
  }

  setValue = (value, callback) => {
    this.setState({
      inputValue: '',
      value,
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleRemove = async (removedValue, currentValue) => {
    const { onRemove } = this.props;

    if (typeof onRemove === 'function') {
      const { success } = await onRemove(removedValue);

      if (success) {
        this.setValue(currentValue);
      }
    }
  };

  handleAdd = async (addedValue, currentValue) => {
    const { onAdd } = this.props;

    if (typeof onAdd === 'function') {
      const { success } = await onAdd(addedValue);

      if (success) {
        this.setValue(currentValue);
      }
    }
  };

  handleChange = async (value, meta) => {
    const { action, removedValue } = meta;

    const { onChange } = this.props;
    const { inputValue } = this.state;

    if (typeof onChange === 'function') {
      this.setValue(value, () => {
        onChange(getLabels(value));
      });
    } else if (action === 'remove-value') {
      await this.handleRemove(removedValue.value, value);
    } else if (action === 'select-option' && meta.option.value) {
      await this.handleAdd(meta.option.label, value);
    } else if (action === 'create-option') {
      await this.handleAdd(inputValue, value);
    }
  };

  loadOptions = (inputValue) => {
    const { loadOptions } = this.props;

    return new Promise((resolve) => {
      if (!inputValue.length || typeof loadOptions !== 'function') {
        resolve();
      } else {
        const options = loadOptions(inputValue);

        resolve(options);
      }
    });
  };

  handleInputChange = (inputValue) => {
    const { maxLength } = this.props;
    const { value } = this.state;

    if (maxLength && value && value.length === maxLength) {
      return;
    }

    this.setState({ inputValue });
  };

  handleKeyDown = async (event) => {
    const { inputValue, value } = this.state;
    const { onAdd, onChange } = this.props;

    if (!inputValue) {
      return null;
    }

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!includes(getLabels(value), inputValue)) {
          if (typeof onAdd === 'function') {
            const response = await onAdd(inputValue);
            if (response.success) {
              this.setValue([...value, { label: inputValue, value: response.id }]);
            }
          } else {
            this.setValue([...value, { label: inputValue, value: inputValue }], () => {
              onChange(getValues(this.state.value));
            });
          }
        }
        event.persist();
        break;
      default:
        break;
    }

    return null;
  };

  renderDropdownIndicator = (props) => {
    const { placeholder } = this.props;

    return components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <i className="fa fa-plus cursor-pointer" id="multi-input-add" />
        <UncontrolledTooltip placement="top" target="multi-input-add">
          {placeholder}
        </UncontrolledTooltip>
      </components.DropdownIndicator>
    );
  };

  renderInput = (props) => {
    const { placeholder, disabled } = this.props;

    return <components.Input {...props} placeholder={placeholder} isDisabled={disabled} />;
  };

  render() {
    const { inputValue, value } = this.state;
    const { disabled, async, className } = this.props;

    return (
      <Choose>
        <When condition={async}>
          <AsyncCreatableSelect
            components={{
              DropdownIndicator: this.renderDropdownIndicator,
              ClearIndicator: null,
              IndicatorSeparator: null,
              Input: this.renderInput,
            }}
            loadOptions={this.loadOptions}
            isMulti
            cacheOptions
            defaultOptions
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
            placeholder={null}
            value={value}
            disabled={disabled}
            inputValue={inputValue}
            className={className}
            classNamePrefix="multi-input"
            menuShouldScrollIntoView
          />
        </When>
        <Otherwise>
          <CreatableSelect
            components={{
              DropdownIndicator: this.renderDropdownIndicator,
              ClearIndicator: null,
              IndicatorSeparator: null,
              Input: this.renderInput,
            }}
            isMulti
            inputValue={inputValue}
            isClearable
            menuIsOpen={false}
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder={null}
            value={value}
            disabled={disabled}
            classNamePrefix="multi-input"
            menuShouldScrollIntoView
          />
        </Otherwise>
      </Choose>
    );
  }
}

export default MultiInput;
