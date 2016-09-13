import React, { Component, PropTypes } from 'react';
import ManageForm from '../../../components/ManageForm';
import { actionTypes } from '../modules/campaign';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.props.createCampaign(data)
      .then((action) => {
        if (action.type === actionTypes.CAMPAIGN_CREATE_SUCCESS) {
          this.props.router.replace('/bonus-campaigns');
        }
      });
  }

  render() {
    return <section className="panel">
      <div className="panel-heading">
        <h3>Create new campaign</h3>
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-lg-8">
            <div className="margin-bottom-50">
              <ManageForm
                onSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </section>;
  }
}
