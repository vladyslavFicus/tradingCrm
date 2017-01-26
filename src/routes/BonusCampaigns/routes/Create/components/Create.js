import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from 'routes/BonusCampaigns/components/ManageForm';

export default class Create extends Component {
  handleSubmit = (data) => {
    this.props.createCampaign(data)
      .then((action) => {
        if (action && !action.error) {
          this.props.router.replace('/bonus-campaigns');
        }
      });
  };

  render() {
    const { currencies } = this.props;

    return <div className="page-content-inner">
      <Panel>
        <Title>
          <h3>Create new campaign</h3>
        </Title>

        <Content>
          <div className="row">
            <div className="col-lg-8">
              <div className="margin-bottom-50">
                <ManageForm
                  onSubmit={this.handleSubmit}
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
