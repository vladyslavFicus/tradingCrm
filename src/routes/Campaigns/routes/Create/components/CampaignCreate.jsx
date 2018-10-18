import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, set } from 'lodash';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';
import Form from '../../../components/Form';
import asyncForEach from '../../../../../utils/asyncForEach';
import { fulfillmentTypes, rewardTemplateTypes } from '../../../constants';
import history from '../../../../../router/history';
import { targetTypes } from '../../../../../constants/campaigns';
import { deviceTypes } from '../../../components/Rewards/constants';

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

    const rewards = await Promise.all(formData.rewards.map(async ({ uuid, deviceType, type, tagName: tagNames }) => {
      let tempUUID = uuid;
      const [tagName] = tagNames;

      if (!uuid && type === rewardTemplateTypes.TAG) {
        const result = await createOrLinkTag({ variables: { tagName } });
        const { data } = get(result, 'data.tag.createOrLink', { data: '', error: '' });

        if (data) {
          tempUUID = data[0].tagId;
        }
      }

      return {
        uuid: tempUUID,
        type: deviceType || deviceTypes.ALL,
      };
    }));
    const campaignData = {
      ...formData,
      rewards: rewards.filter(({ uuid }) => uuid),
      fulfillments: [],
    };

    const response = await createCampaign({ variables: campaignData });
    const error = get(response, 'data.campaign.create.error');

    if (!error) {
      const fulfillments = [];
      const { uuid: campaignUUID } = get(response, 'data.campaign.create.data', {});

      const updateCampaignVariables = { ...campaignData, uuid: campaignUUID };

      if (formData.fulfillments && formData.fulfillments.length > 0) {
        await asyncForEach(formData.fulfillments, async ({ type, uuid: defaultUUID, ...fulfillment }) => {
          let uuid = defaultUUID;

          if (type === fulfillmentTypes.WAGERING) {
            const fulfillmentResponse = await addWageringFulfillment({
              variables: fulfillment,
            });
            uuid = get(fulfillmentResponse, 'data.wageringFulfillment.add.data.uuid');
          } else if (type === fulfillmentTypes.DEPOSIT) {
            const fulfillmentResponse = await addDepositFulfillment({
              variables: fulfillment,
            });
            uuid = get(fulfillmentResponse, 'data.depositFulfillment.add.data.uuid');
          } else if (type === fulfillmentTypes.GAMING) {
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
          updateCampaignVariables.fulfillments = fulfillments;
        }
      }

      const tags = [];

      if (formData.tags && formData.tags.length) {
        await asyncForEach(formData.tags, async (tagName) => {
          const result = await createOrLinkTag({ variables: { tagName, targetUUID: campaignUUID } });

          const { data: responseData } = get(result, 'data.tag.createOrLink', { data: [], error: '' });

          if (responseData) {
            tags.push(responseData[0].tagId);
          }
        });
      }

      if (tags.length) {
        updateCampaignVariables.tags = tags;
      }

      await updateCampaign({ variables: updateCampaignVariables });

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
            tags: [],
          }}
          onSubmit={this.handleCreateCampaign}
        />
      </div>
    );
  }
}

export default CampaignCreate;
