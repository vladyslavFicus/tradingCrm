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
      <div className="player__account__details_additional col-md-3">
        <span className="player__account__details_additional-label">Additional information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5 height-200">
            <small className="player__account__details_additional-label">
              Marketing
            </small>
            <div className="row">
              <div className="col-xs-6">
                <b>SMS</b>:
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
                <b>News</b>:
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
                <b>Snail mail</b>:
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
