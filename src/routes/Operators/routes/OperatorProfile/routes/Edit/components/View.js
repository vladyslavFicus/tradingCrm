import React, { Component, PropTypes } from 'react';
import OperatorPersonalForm from './OperatorPersonalForm';
import OperatorContactsForm from './OperatorContactsForm';

export default class OperatorProfile extends Component {

  handleSubmitOperatorPersonal = (personalData) => {
    console.log(personalData);
  };

  handleSubmitOperatorContacts = (contactsData) => {
    console.log(contactsData);
  };

  render() {
    const {
      data: {
        firstName,
        lastName,
        country,
        email,
        phone,
      },
    } = this.props;

    return (
      <div className="player__account__page_profile tab-content padding-vertical-20">
        <div className="tab-pane active" id="home1" role="tabpanel">
          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <OperatorPersonalForm
                  initialValues={{
                    firstName,
                    lastName,
                    country,
                  }}
                  onSubmit={this.handleSubmitOperatorPersonal}
                />
              </div>
            </div>
          </div><div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <OperatorContactsForm
                  initialValues={{
                    phone,
                    email,
                  }}
                  onSubmit={this.handleSubmitOperatorContacts}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OperatorProfile.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
  data: PropTypes.object,
};
