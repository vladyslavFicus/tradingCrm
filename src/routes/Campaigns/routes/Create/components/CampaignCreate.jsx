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
    updateCampaign: PropTypes.func.isRequired,
  };

  handleCreateCampaign = async (formData) => {
    const {
      createCampaign,
      updateCampaign,
      notify,
      addWageringFulfillment,
      addDepositFulfillment,
    } = this.props;

    const campaignData = {
      ...formData,
      rewards: formData.rewards.map(({ uuid, deviceType }) => ({
        uuid,
        type: deviceType,
      })),
      fulfillments: [],
    };

    const response = await createCampaign({ variables: campaignData });
    const error = get(response, 'data.campaign.create.error');

    if (!error) {
      const fulfillments = [];
      const { uuid: campaignUUID } = get(response, 'data.campaign.create.data', {});

      if (formData.fulfillments && formData.fulfillments.length > 0) {
        await asyncForEach(formData.fulfillments, async (fulfillment) => {
          let uuid = null;

          if (fulfillment.type === fulfillmentTypes.WAGERING) {
            const fulfillmentResponse = await addWageringFulfillment({
              variables: fulfillment,
            });
            uuid = get(fulfillmentResponse, 'data.wageringFulfillment.add.data.uuid');
          } else if (fulfillment.type === fulfillmentTypes.DEPOSIT) {
            const fulfillmentResponse = await addDepositFulfillment({
              variables: fulfillment,
            });
            uuid = get(fulfillmentResponse, 'data.depositFulfillment.add.data.uuid');
          }

          if (uuid) {
            fulfillments.push(uuid);
          }
        });

        if (fulfillments.length > 0) {
          await updateCampaign({ variables: { ...campaignData, uuid: campaignUUID, fulfillments } });
        }
      }

      history.push(`/campaigns/view/${campaignUUID}/settings`);
    }

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_CAMPAIGN'),
      message: I18n.t(`CAMPAIGNS.VIEW.NOTIFICATIONS.${error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
    });
  };

  render() {
    return (
      <div className="profile">
        <Header />
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
