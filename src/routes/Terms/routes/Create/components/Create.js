import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from '../../../components/ManageForm';
import { actionTypes } from '../modules/create';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckExists = this.handleCheckExists.bind(this);
    this.handleAsyncValidate = this.handleAsyncValidate.bind(this);
  }

  handleSubmit(data) {
    this.props.createBonus(data)
      .then((action) => {
        if (action.type === actionTypes.CREATE_BONUS.SUCCESS) {
          this.props.router.replace('/terms-and-conditions');
        }
      });
  }

  render() {
    const { params } = this.props;
    const initialValues = { state: 'INACTIVE' };

    if (params.uuid) {
      initialValues.playerUUID = params.uuid;
    }

    return <div className="page-content-inner">
      <Panel>
        <Title>
          <h3>Create bonus</h3>
        </Title>
        <Content>
          <div className="row">
            <div className="col-lg-8">
              <div className="margin-bottom-50">
                <ManageForm
                  asyncValidate={this.handleAsyncValidate}
                  asyncBlurFields={['playerUUID']}
                  onSubmit={this.handleSubmit}
                  initialValues={initialValues}
                />
              </div>
            </div>
          </div>
        </Content>
      </Panel>
    </div>;
  }
}
