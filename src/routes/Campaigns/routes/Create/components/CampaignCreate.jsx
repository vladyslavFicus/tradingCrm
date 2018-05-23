import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';
import Form from '../../../components/Form';
import asyncForEach from '../../../../../utils/asyncForEach';
import { fulfillmentTypes } from '../../../constants';
import history from '../../../../../router/history';
import { targetTypes } from '../../../../../constants/campaigns';

class CampaignCreate extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    addWageringFulfillment: PropTypes.func.isRequired,
    addDepositFulfillment: PropTypes.func.isRequired,
    createCampaign: PropTypes.func.isRequired,
  };

  handleCreateCampaign = async (formData) => {
    const {
      createCampaign,
      notify,
      addWageringFulfillment,
      addDepositFulfillment,
    } = this.props;

    const fulfillments = [];

    await asyncForEach(formData.fulfillments, async (fulfillment) => {
      let uuid = null;

      if (fulfillment.type === fulfillmentTypes.WAGERING) {
        const response = await addWageringFulfillment({
          variables: fulfillment,
        });
        uuid = get(response, 'data.wageringFulfillment.add.data.uuid');
      } else if (fulfillment.type === fulfillmentTypes.DEPOSIT) {
        const response = await addDepositFulfillment({
          variables: fulfillment,
        });
        uuid = get(response, 'data.depositFulfillment.add.data.uuid');
      }

      if (uuid) {
        fulfillments.push(uuid);
      }
    });

    const action = await createCampaign({
      variables: {
        ...formData,
        rewards: formData.rewards.map(({ uuid }) => uuid),
        fulfillments,
      },
    });

    const error = get(action, 'data.campaign.create.error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_CAMPAIGN'),
      message: I18n.t(`CAMPAIGNS.VIEW.NOTIFICATIONS.${error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
    });

    if (!error) {
      const { uuid } = get(action, 'data.campaign.create.data');

      history.push(`/campaigns/view/${uuid}/settings`);
    }
  };

  render() {
    return (
      <div className="profile">
        <div className="profile__info">
          <Header />
        </div>
        <Form
          form="createCampaign"
          initialValues={{
            targetType: targetTypes.ALL,
            optIn: false,
            rewards: [],
            fulfillments: [],
          }}
          onSubmit={this.handleCreateCampaign}
        />
      </div>
    );
  }
}

export default CampaignCreate;
