import React, { Component } from 'react';
import { includes, get } from 'lodash';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import PropTypes from '../../../../../../constants/propTypes';

const components = { DropdownIndicator: null, ClearIndicator: null };

const getLabels = value => (Array.isArray(value) ? value.map(v => v.label) : []);

class PlayerTags extends Component {
  static propTypes = {
    unlinkTag: PropTypes.func.isRequired,
    createOrLinkTag: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    playerTags: PropTypes.shape({
      playerTags: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          tagId: PropTypes.string,
          tagName: PropTypes.string,
        })),
      }),
    }),
  };

  static defaultProps = {
    playerTags: {},
  };

  state = {
    inputValue: '',
    value: [],
  };

  getSnapshotBeforeUpdate(prevProps) {
    const currentTags = get(this.props, 'playerTags.playerTags.content', []);
    const prevTags = get(prevProps, 'playerTags.playerTags.content', []);

    if (!prevTags.length && currentTags.length) {
      return true;
    }

    return null;
  }

  componentDidUpdate(_, __, snapshot) {
    if (snapshot !== null) {
      const tags = get(this.props, 'playerTags.playerTags.content', []);

      this.setState({
        value: tags.map(v => ({ label: v.tagName, value: v.tagId })),
      });
    }
  }

  handleChange = async (value, { action, removedValue }) => {
    const {
      unlinkTag,
      match: { params: { id } },
    } = this.props;

    if (action === 'remove-value' && removedValue && removedValue.value) {
      const response = await unlinkTag({
        variables: { tagId: removedValue.value, targetUUID: id },
      });

      const success = get(response, 'data.tag.unlink.success');

      if (success) {
        this.setState({ value });
      }
    }
  };

  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };

  handleKeyDown = async (event) => {
    const {
      createOrLinkTag,
      match: { params: { id } },
    } = this.props;

    const { inputValue, value } = this.state;

    if (!inputValue) {
      return null;
    }

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!includes(getLabels(value), inputValue)) {
          const response = await createOrLinkTag({
            variables: { tagName: inputValue, targetUUID: id, pinned: true },
          });

          const error = get(response, 'data.tag.createOrLink.error');
          const tagId = get(response, 'data.tag.createOrLink.data.0.tagId');

          if (!error && tagId) {
            this.setState({
              inputValue: '',
              value: [...value, { label: inputValue, value: tagId }],
            });
          }
        }

        event.persist();
        break;
      default:
        break;
    }
  };

  render() {
    const { value, inputValue } = this.state;

    return (
      <AsyncCreatableSelect
        components={components}
        isMulti
        cacheOptions
        defaultOptions
        onInputChange={this.handleInputChange}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
        inputValue={inputValue}
      />
    );
  }
}

export default PlayerTags;
