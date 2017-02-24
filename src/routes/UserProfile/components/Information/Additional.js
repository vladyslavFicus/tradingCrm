import React, { Component, PropTypes } from 'react';
import Switch from 'components/Forms/Switch';

const SUBSCRIPTION_TYPE_SMS = 'marketingSMS';
const SUBSCRIPTION_TYPE_NEWS = 'marketingNews';
const SUBSCRIPTION_TYPE_MAIL = 'marketingMail';

class Additional extends Component {
  handleSwitch = (name) => (value) => {
    this.props.updateSubscription(name, value);
  };

  render() {
    const { initialValues } = this.props;
    
    return (
      <div className="player__account__details_additional col-md-3">
        <span className="player__account__details_additional-label">Additional information</span>
        <div className="panel panel-with-borders">
          <div className="panel-body padding-5 panel-body-min-height">
            <small className="player__account__details_additional-label">
              Marketing
            </small>
            <div><b>SMS</b>:
              <div className="player__account__details_additional-switcher">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_SMS]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_SMS)}
                />
              </div>
            </div>
            <div><b>News</b>:
              <div className="player__account__details_additional-switcher">
                <Switch
                  active={initialValues[SUBSCRIPTION_TYPE_NEWS]}
                  handleSwitch={this.handleSwitch(SUBSCRIPTION_TYPE_NEWS)}
                />
              </div>
            </div>
            <div><b>Snail mail</b>:
              <div className="player__account__details_additional-switcher">
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

Additional.propTypes = {
  updateSubscription: PropTypes.func.isRequired,
};
Additional.defaultProps = {};

export default Additional;
