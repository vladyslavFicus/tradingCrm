import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { nodeTypes, nodeTypesLabels } from '../constants';

class ProfileCompleted extends Component {
  static propTypes = {
    remove: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    load: PropTypes.func.isRequired,
    nodePath: PropTypes.string.isRequired,
  };
  static defaultProps = {
    disabled: false,
  };

  componentWillMount() {
    this.props.load();
  }

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  render() {
    const { disabled, remove } = this.props;

    return (
      <div className="container-fluid add-campaign-container">
        <div className="row align-items-center">
          <div className="col text-truncate add-campaign-label">
            {I18n.t(nodeTypesLabels[nodeTypes.profileCompleted])}
          </div>
          {
            !disabled &&
            <div className="col-auto text-right">
              <button
                className="btn-transparent add-campaign-remove"
                type="button"
                onClick={remove}
              >
                &times;
              </button>
            </div>
          }
        </div>
        <Field
          name={this.buildFieldName('profileCompleted')}
          component="input"
          type="checkbox"
          hidden
        />
      </div>
    );
  }
}

export default ProfileCompleted;
