import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from 'routes/BonusCampaigns/components/ManageForm';
import { actionTypes } from '../modules/update';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.props.updateCampaign(this.props.data.id, data)
      .then((action) => {
        if (action && action.type === actionTypes.CAMPAIGN_UPDATE.SUCCESS) {
          this.props.router.replace('/bonus-campaigns');
        }
      });
  }

  render() {
    const { data }  = this.props;

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
                  disabled={data.state !== 'INACTIVE'}
                />
              </div>
            </div>
          </div>
        </Content>
      </Panel>
    </div>;
  }
}
