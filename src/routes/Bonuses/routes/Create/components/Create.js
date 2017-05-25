import React, { Component } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import ManageForm from 'routes/Bonuses/components/ManageForm';
import { actionTypes as profileActionTypes } from 'routes/Users/modules/view';

export default class Create extends Component {
  handleSubmit = (data) => {
    this.props.createBonus(data)
      .then((action) => {
        if (action && !action.error) {
          if (this.props.params.uuid) {
            this.props.router.replace(`/users/${this.props.params.uuid}/bonuses`);
          } else {
            this.props.router.replace(`/bonuses`);
          }
        }
      });
  };

  handleAsyncValidate = (values, dispatch, props, blurredField) => {
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
  };

  handleCheckExists = (field, value) => {
    return this.props.fetchProfile(value)
      .then((action) => {
        if (action.type !== profileActionTypes.PROFILE.SUCCESS) {
          throw { [field]: 'Player not found.' };
        }
      });
  };

  render() {
    const { params, currencies } = this.props;
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
