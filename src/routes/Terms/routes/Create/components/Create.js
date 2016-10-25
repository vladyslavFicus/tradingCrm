import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from '../../../components/ManageForm';
import { actionTypes } from '../modules/create';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.props.createTerm(data)
      .then((action) => {
        if (action.type === actionTypes.CREATE_TERMS.SUCCESS) {
          this.props.router.replace('/terms');
        }
      });
  }

  render() {
    const { params } = this.props;

    return <div className="page-content-inner">
      <Panel>
        <Title>
          <h3>Create T&C</h3>
        </Title>
        <Content>
          <div className="row">
            <div className="col-lg-8">
              <div className="margin-bottom-50">
                <ManageForm
                  onSubmit={this.handleSubmit}
                />
              </div>
            </div>
          </div>
        </Content>
      </Panel>
    </div>;
  }
}
