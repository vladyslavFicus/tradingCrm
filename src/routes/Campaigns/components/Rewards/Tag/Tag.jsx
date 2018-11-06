import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Field, Fields } from 'redux-form';
import TagsAsync from '../../../../../components/TagsAsync';

class Tag extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  renderField = ({ name, ...props }) => {
    const { tagName, uuid } = get(props, name);

    return (
      <Field
        name={tagName.input.name}
        type="text"
        component={TagsAsync}
        maxLength={1}
        label={I18n.t('CAMPAIGNS.REWARDS.TAG.NAME')}
        disabled={!!uuid.input.value}
        async
      />
    );
  };

  render() {
    const { name } = this.props;

    return (
      <Fields names={[`${name}.tagName`, `${name}.uuid`]} name={name} component={this.renderField} />
    );
  }
}

export default Tag;
