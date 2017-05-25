import React, { Component } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from 'routes/BonusCampaigns/components/ManageForm';
import { statuses } from 'routes/BonusCampaigns/constants';

export default class Update extends Component {
  handleSubmit = (data) => {
    this.props.updateCampaign(this.props.data.id, data)
      .then((action) => {
        if (action && !action.error) {
          this.props.router.replace('/bonus-campaigns');
        }
      });
  };

  render() {
    const { data, currencies }  = this.props;

    return <div className="page-content-inner">
      <Panel>
        <Title>
          <h3>Update campaign</h3>
        </Title>

        <Content>
          <div className="row">
            <div className="col-lg-8">
              <div className="margin-bottom-50">
                <ManageForm
                  initialValues={data}
                  onSubmit={this.handleSubmit}
                  disabled={data.state !== statuses.INACTIVE}
                  currencies={currencies}
                />
              </div>
            </div>
          </div>
        </Content>
      </Panel>
    </div>;
  }
}
