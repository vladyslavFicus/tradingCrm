import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { nodeTypes, nodeTypesLabels } from '../constants';

class NoFulfillments extends Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    nodePath: PropTypes.string.isRequired,
  };

  componentWillMount() {
    this.props.load();
  }

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  render() {
    return (
      <div className="container-fluid add-campaign-container">
        <div className="row align-items-center">
          <div className="col text-truncate add-campaign-label">
            {I18n.t(nodeTypesLabels[nodeTypes.noFulfillments])}
          </div>
          <div className="col-auto text-right">
            <button
              className="btn-transparent add-campaign-remove"
              type="button"
              onClick={this.props.remove}
            >
              &times;
            </button>
          </div>
        </div>
        <Field
          name={this.buildFieldName('noFulfillments')}
          component="input"
          type="checkbox"
          hidden
        />
      </div>
    );
  }
}

export default NoFulfillments;
