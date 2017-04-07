import React, { Component, PropTypes } from 'react';
import Switch from '../../../../components/Forms/Switch';

const SUBSCRIPTION_TYPE_SMS = 'marketingSMS';
const SUBSCRIPTION_TYPE_NEWS = 'marketingNews';
const SUBSCRIPTION_TYPE_MAIL = 'marketingMail';

class Additional extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    updateSubscription: PropTypes.func.isRequired,
  };

  handleSwitch = name => (value) => {
    this.props.updateSubscription(name, value);
  };

  render() {
    const { initialValues } = this.props;

    return (
      <div className="player__account__details_additional">
        <span className="player__account__details-label">Additional information</span>
        <div className="panel">
          <div className="panel-body height-200">
            <small className="player__account__details_additional-label">
              Marketing
            </small>
            <div className="row">
              <div className="col-xs-6">
                <span>SMS</span>
              </div>
              <div className="col-xs-6 text-right">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_SMS]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_SMS)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <span>News</span>
              </div>
              <div className="col-xs-6 text-right">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_NEWS]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_NEWS)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <span>Snail mail</span>
              </div>
              <div className="col-xs-6 text-right">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_MAIL]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_MAIL)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Additional;

