import React, { Component, PropTypes } from 'react';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import { actionTypes as profileActionTypes } from '../../../modules/view';

class View extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    profile: PropTypes.shape({
      data: PropTypes.object,
      receivedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    }),
    updateProfile: PropTypes.func.isRequired,
    updateIdentifier: PropTypes.func.isRequired,
  };

  handleSubmit = (data) => {
    const { params: { id }, updateProfile } = this.props;
    return updateProfile(id, data);
  };

  handleSubmitPersonal = (data) => {
    const { params: { id }, updateProfile, updateIdentifier } = this.props;

    return updateProfile(id, data).then((action) => {
      if (action.type === profileActionTypes.UPDATE_PROFILE.SUCCESS && data.identifier) {
        updateIdentifier(id, data.identifier);
      }
    });
  };

  render() {
    const { profile: { data, receivedAt } } = this.props;
    if (!receivedAt) {
      return null;
    }

    return (
      <div className="player__account__page_profile tab-content padding-vertical-20">
        <div className="tab-pane active" id="home1" role="tabpanel">
          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <PersonalForm
                  initialValues={{
                    firstName: data.firstName,
                    lastName: data.lastName,
                    birthDate: data.birthDate,
                    identifier: data.identifier,
                    gender: data.gender,
                  }}
                  onSubmit={this.handleSubmitPersonal}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <AddressForm
                  initialValues={{
                    country: data.country,
                    address: data.address,
                  }}
                  onSubmit={this.handleSubmit}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <ContactForm
                  initialValues={{
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                  }}
                  onSubmit={this.handleSubmit}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default View;
