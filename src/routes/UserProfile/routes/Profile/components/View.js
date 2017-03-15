import React, { Component, PropTypes } from 'react';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';
import DocumentsForm from './Documents/Form';
import { actionTypes as profileActionTypes } from '../../../modules/view';
import VerifyIdentity from './Kyc/VerifyIdentity';
import { types as kysTypes } from 'constants/kyc';

class View extends Component {
  handleSubmit = (data) => {
    const { params : { id }, updateProfile } = this.props;
    return updateProfile(id, data);
  };

  handleSubmitPersonal = (data) => {
    const { params: { id }, updateProfile, updateIdentifier } = this.props;

    return updateProfile(id, data).then(action => {
      if (action.type === profileActionTypes.UPDATE_PROFILE.SUCCESS && data.identifier) {
        updateIdentifier(id, data.identifier);
      }
    });
  };

  handleVerifyIdentity = (type) => () => {
    const { params: { id }, verifyIdentity } = this.props;
    verifyIdentity(id, type)
      .then(action => {
        console.log('handleVerifyIdentity action', action);
    });
  };

  handleRefuseIdentity = type => data => {
    const { params: { id }, refuseIdentity } = this.props;
    return refuseIdentity(id, type, data)
      .then(action => {
        console.log('refuseIdentity action', action);
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
                <DocumentsForm
                  entities={data.personalKycMetaData}
                />
              </div>
              <div className="col-md-4">
                <VerifyIdentity
                  onVerifyIdentity={this.handleVerifyIdentity(kysTypes.PERSONAL)}
                  onRefuseIdentity={this.handleRefuseIdentity(kysTypes.PERSONAL)}
                  status={data.personalStatus}
                  profile={{
                    initials: [data.firstName, data.lastName].join(' '),
                    language: data.languageCode,
                  }}
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
                <hr />
                <DocumentsForm
                  entities={data.addressKycMetaData}
                />
              </div>
              <div className="col-md-4">
                <VerifyIdentity
                  onVerifyIdentity={this.handleVerifyIdentity(kysTypes.ADDRESS)}
                  onRefuseIdentity={this.handleRefuseIdentity(kysTypes.ADDRESS)}
                  status={data.addressStatus}
                  profile={{
                    initials: [data.firstName, data.lastName].join(' '),
                    language: data.languageCode,
                  }}
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
