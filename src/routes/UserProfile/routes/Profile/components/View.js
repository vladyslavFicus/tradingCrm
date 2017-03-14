import React, { Component, PropTypes } from 'react';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import DocumentsForm from './Documents/Form';
import { actionTypes as profileActionTypes } from '../../../modules/view';
import KycVerify from './KycVerify';
import { types as kysTypes } from 'constants/kyc';

class View extends Component {
  handleSubmit = (data) => {
    const { params } = this.props;
    return this.props.updateProfile(params.id, data);
  };

  handleSubmitPersonal = (data) => {
    const { params: { id }, updateProfile, updateIdentifier } = this.props;

    return updateProfile(id, data).then(action => {
      if (action.type === profileActionTypes.UPDATE_PROFILE.SUCCESS && data.identifier) {
        updateIdentifier(id, data.identifier);
      }
    });
  };

  handleKYCStatusChange = () => {
    console.log('handleKYCStatusChange');
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
              <div className="col-md-8 profile-bordered-block">
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
                <hr />
                <DocumentsForm />
              </div>
              <div className="col-md-4">
                <KycVerify
                  type={kysTypes.PERSONAL}
                  status={data.personalStatus.value}
                  onStatusChange={this.handleKYCStatusChange}
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
              <div className="col-md-4">
                <KycVerify
                  type={kysTypes.ADDRESS}
                  status={data.addressStatus.value}
                  onStatusChange={this.handleKYCStatusChange}
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
