import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from '../../constants/propTypes';
import { tagsByTextQuery } from '../../graphql/queries/tags';
import MultiInput from '../MultiInput';
import MultiInputField from '../ReduxForm/MultiInputField';

class TagsAsync extends Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    input: PropTypes.object,
  };

  static defaultProps = {
    input: null,
  };

  onLoadOptions = async (text) => {
    const response = await this.props.client.query({
      query: tagsByTextQuery,
      variables: { text },
    });

    return get(response, 'data.tagsByText.data.content', []).map(t => ({ value: t.tagId, label: t.tagName }));
  };

  render() {
    const component = this.props.input ? MultiInputField : MultiInput;

    return React.createElement(component, {
      ...this.props,
      loadOptions: this.onLoadOptions,
    });
  }
}

export default withApollo(TagsAsync);
