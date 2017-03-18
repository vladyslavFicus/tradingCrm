import React, { Component, PropTypes } from 'react';
import PersonalForm from './PersonalForm';
import ContactsForm from './ContactsForm';

class View extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    data: PropTypes.object,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    receivedAt: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  };

  handleSubmit = (data) => {
    const { params: { id }, updateProfile } = this.props;
    return updateProfile(id, data);
  };

  render() {
    const { data, receivedAt } = this.props;
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
                    country: data.country,
                  }}
                  onSubmit={this.handleSubmit}
                />
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-body row">
              <div className="col-md-8">
                <ContactsForm
                  initialValues={{
                    phone: data.phone,
                    email: data.email,
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
