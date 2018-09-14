import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { v4 } from 'uuid';
import { get, set } from 'lodash';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';
import Form from '../../../components/Form';
import asyncForEach from '../../../../../utils/asyncForEach';
import { fulfillmentTypes, rewardTemplateTypes } from '../../../constants';
import history from '../../../../../router/history';
import { targetTypes } from '../../../../../constants/campaigns';

class CampaignCreate extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    addWageringFulfillment: PropTypes.func.isRequired,
    addDepositFulfillment: PropTypes.func.isRequired,
    addGamingFulfillment: PropTypes.func.isRequired,
    createCampaign: PropTypes.func.isRequired,
    updateCampaign: PropTypes.func.isRequired,
  };

  handleCreateCampaign = async (formData) => {
    const {
      createCampaign,
      updateCampaign,
      notify,
      addWageringFulfillment,
      createOrLinkTag,
      addDepositFulfillment,
      addGamingFulfillment,
    } = this.props;

    const rewards = await Promise.all(formData.rewards.map(async ({ uuid, deviceType, type, tagName }) => {
      let tempUUID = uuid;
      if (!uuid && type === rewardTemplateTypes.TAG) {
        const result = await createOrLinkTag({ variables: { tagId: `TAG-${v4()}`, tagName } });
        const { data } = get(result, 'data.tag.createOrLink', { data: '', error: '' });

        if (data) {
          tempUUID = data[0].tagId;
        }
      }

      return {
        uuid: tempUUID,
        type: deviceType || 'ALL',
      };
    }));
    const campaignData = {
      ...formData,
      rewards,
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
          } else if (fulfillment.type === fulfillmentTypes.GAMING) {
            const fulfillmentResponse = await addGamingFulfillment({
              variables: fulfillment,
            });
            uuid = get(fulfillmentResponse, 'data.gamingFulfillment.add.data.uuid');
          }

          if (uuid) {
            fulfillments.push(uuid);
          }
        });

        if (fulfillments.length > 0) {
          await updateCampaign({ variables: { ...campaignData, uuid: campaignUUID, fulfillments } });
        }
      }

      notify({
        level: 'success',
        title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_CAMPAIGN'),
        message: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.SUCCESSFULLY'),
      });
      history.push(`/campaigns/view/${campaignUUID}/settings`);
    } else {
      const fieldsErrors = {};

      if (error && error.fields_errors) {
        Object.keys(error.fields_errors).forEach(i => set(fieldsErrors, i, error.fields_errors[i]));
      }

      notify({
        level: 'error',
        title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_CAMPAIGN'),
        message: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.UNSUCCESSFULLY'),
      });

      throw new SubmissionError({ ...fieldsErrors });
    }
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
