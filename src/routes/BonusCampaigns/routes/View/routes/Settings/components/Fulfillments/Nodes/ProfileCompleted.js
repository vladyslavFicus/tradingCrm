import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { nodeTypes, nodeTypesLabels } from '../constants';

class ProfileCompleted extends Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.load();
  }

  render() {
    return (
      <div className="add-campaign-container">
        <div className="add-campaign-label">
          {I18n.t(nodeTypesLabels[nodeTypes.profileCompleted])}
        </div>
        <Field
          name="fulfillments.profileCompleted"
          component="input"
          type="checkbox"
          hidden
        />
        <button
          className="btn-transparent add-campaign-remove"
          type="button"
          onClick={this.props.remove}
        >
          &times;
        </button>
      </div>
    );
  }
}

export default ProfileCompleted;
