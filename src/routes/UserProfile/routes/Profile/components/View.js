import React, { Component, PropTypes } from 'react';
import PersonalForm from './PersonalForm';
import AddressForm from './AddressForm';
import ContactForm from './ContactForm';

class View extends Component {
  handleSubmit = (data) => {
    const { params } = this.props;
    return this.props.updateProfile(params.id, data);
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
                  onSubmit={this.handleSubmit}
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

View.propTypes = {};
View.defaultProps = {};

export default View;
