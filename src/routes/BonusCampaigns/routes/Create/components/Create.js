import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import Panel, { Title, Content } from '../../../../../components/Panel';
import ManageForm from '../../../components/ManageForm';

export default class Create extends Component {
  handleSubmit = async (data) => {
    const action = await this.props.createCampaign(data);

    if (action) {
      if (!action.error) {
        this.props.router.replace('/bonus-campaigns');
      } else if (action.payload.response.fields_errors) {
        const errors = Object.keys(action.payload.response.fields_errors).reduce((res, name) => ({
          ...res,
          [name]: action.payload.response.fields_errors[name].error,
        }), {});
        throw new SubmissionError(errors);
      } else if (action.payload.response.error) {
        throw new SubmissionError({ _error: action.payload.response.error });
      }
    }

    return action;
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
