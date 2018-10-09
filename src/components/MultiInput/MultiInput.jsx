import React, { Component } from 'react';
import { includes } from 'lodash';
import CreatableSelect from 'react-select/lib/Creatable';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import PropTypes from 'prop-types';

const getValues = value => (Array.isArray(value) ? value.map(v => v.value) : []);

class MultiInput extends Component {
  static propTypes = {
    async: PropTypes.bool,
    components: PropTypes.object,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    initialValues: PropTypes.array,
  };

  static defaultProps = {
    async: false,
    components: {},
    placeholder: '',
    disabled: false,
    onChange: null,
    onRemove: null,
    initialValues: [],
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
        if (!includes(getValues(value), inputValue)) {
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

  render() {
    const { inputValue, value } = this.state;

    const { components, placeholder, disabled, async } = this.props;

    const inputField = async
      ?
      (
        <AsyncCreatableSelect
          components={components}
          isMulti
          cacheOptions
          defaultOptions
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onInputChange={this.handleInputChange}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          inputValue={inputValue}
        />
      )
      :
      (
        <CreatableSelect
          components={components}
          isMulti
          inputValue={inputValue}
          isClearable
          menuIsOpen={false}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
        />
      );

    return inputField;
  }
}

export default MultiInput;
