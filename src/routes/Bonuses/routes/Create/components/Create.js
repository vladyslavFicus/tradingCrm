import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from '../../../components/ManageForm';
import { actionTypes } from '../modules/create';
import { actionTypes as profileActionTypes } from 'routes/Users/modules/view';

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
          this.props.router.replace('/bonuses');
        }
      });
  }

  handleAsyncValidate(values, dispatch, props, blurredField) {
    const oldErrors = props.asyncErrors || {};

    return new Promise((resolve, reject) => {
      if (blurredField) {
        this.handleCheckExists(blurredField, values[blurredField])
          .then(() => resolve(oldErrors), (error) => reject({
            ...oldErrors,
            ...error,
          }));
      } else {
        resolve(oldErrors);
      }
    });
  }

  handleCheckExists(field, value) {
    return this.props.fetchProfile(value)
      .then((action) => {
        if (action.type !== profileActionTypes.PROFILE.SUCCESS) {
          throw { [field]: 'Player not found.' };
        }
      });
  }

  render() {
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
                  initialValues={{ state: 'INACTIVE' }}
                />
              </div>
            </div>
          </div>
        </Content>
      </Panel>
    </div>;
  }
}
