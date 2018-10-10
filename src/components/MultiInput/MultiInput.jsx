import React, { Component } from 'react';
import { includes } from 'lodash';
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
    initialValues: PropTypes.array,
    className: PropTypes.string,
  };

  static defaultProps = {
    async: false,
    placeholder: '',
    disabled: false,
    onChange: null,
    onRemove: null,
    initialValues: [],
    className: null,
  };

  state = {
    inputValue: '',
    value: this.props.initialValues,
  };

  handleChange = async (value, { action, removedValue }) => {
    const { onChange, onRemove } = this.props;

    if (action === 'remove-value' && typeof onRemove === 'function') {
      const { success } = await onRemove(removedValue.value);

      if (success) {
        this.setState({ value });
      }
    }

    if (typeof onChange === 'function') {
      this.setState({ value }, () => {
        onChange(getValues(value));
      });
    }
  };

  handleInputChange = (inputValue) => {
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
              this.setState({
                inputValue: '',
                value: [...value, { label: inputValue, value: response.id }],
              });
            }
          } else {
            this.setState({
              inputValue: '',
              value: [...value, { label: inputValue, value: inputValue }],
            }, () => {
              onChange(getValues(this.state.value));
            });
          }
        }
        event.persist();
        break;
    }
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
    const { placeholder } = this.props;

    if (props.isHidden) {
      return <components.Input {...props} placeholder={placeholder} />;
    }
    return (
      <components.Input {...props} placeholder={placeholder} />
    );
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
            isMulti
            cacheOptions
            defaultOptions
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
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
