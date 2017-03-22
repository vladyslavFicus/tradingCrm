import React, { Component, PropTypes } from 'react';
import Form from './Form';

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
              <div className="col-md-12">
                <Form
                  initialValues={{
                    firstName: data.firstName,
                    lastName: data.lastName,
                    country: data.country,
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
