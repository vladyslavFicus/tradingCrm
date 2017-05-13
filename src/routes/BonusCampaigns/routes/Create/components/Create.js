import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import Panel, { Title, Content } from '../../../../../components/Panel';
import ManageForm from '../../../components/ManageForm';

export default class Create extends Component {
  handleSubmit = async (data) => {
    const action = await this.props.createCampaign(data);

    if (action && !action.error) {
      this.props.router.replace('/bonus-campaigns');
    } else if (action.payload.field_errors) {
      throw new SubmissionError(Object.keys(action.payload.field_errors).reduce((res, name) => ({
        ...res,
        [name]: action.payload.field_errors[name].error,
      }), {}));
    } else if (action.payload.error) {
      throw new SubmissionError({ _error: action.payload.error });
    }
  };

  render() {
    const { currencies } = this.props;

    return (
      <div className="page-content-inner">
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
      </div>
    );
  }
}
