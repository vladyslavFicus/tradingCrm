import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import Form from '../../../../../components/Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import asyncForEach from '../../../../../../../utils/asyncForEach';
import { fulfilmentTypes as fulfillmentTypes } from '../../../../../constants';
import Permissions from '../../../../../../../utils/permissions';
import permissions from '../../../../../../../config/permissions';
import deepRemoveKeyByRegex from '../../../../../../../utils/deepKeyPrefixRemove';

class SettingsView extends Component {
  static propTypes = {
    updateCampaign: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    addWageringFulfillment: PropTypes.func.isRequired,
    campaign: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      campaign: PropTypes.shape({
        data: PropTypes.newBonusCampaignEntity.isRequired,
      }),
    }).isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  handleUpdateCampaign = async (formData) => {
    const {
      updateCampaign,
      notify,
      addWageringFulfillment,
      addDepositFulfillment,
      campaign: {
        campaign: {
          data,
        },
      },
    } = this.props;

    const fulfillments = formData.fulfillments
      .filter(({ uuid }) => uuid)
      .map(({ uuid }) => uuid);
    const newFulfillments = formData.fulfillments.filter(({ uuid }) => !uuid);

    await asyncForEach(newFulfillments, async (fulfillment) => {
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

    const action = await updateCampaign({
      variables: {
        ...formData,
        uuid: data.uuid,
        rewards: formData.rewards.map(({ uuid }) => uuid),
        fulfillments,
      },
    });

    const error = get(action, 'data.campaign.update.error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.UPDATE_TITLE'),
      message: I18n.t(`CAMPAIGNS.VIEW.NOTIFICATIONS.${error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
    });
  };

  render() {
    const {
      campaign: {
        campaign: {
          data: {
            name,
            state,
            fulfillments,
            rewards,
            startDate,
            endDate,
          },
        },
      },
    } = this.props;
    const { permissions: currentPermissions } = this.context;
    const disabled = !new Permissions(permissions.CAMPAIGNS.UPDATE)
      .check(currentPermissions) || state !== statuses.DRAFT;

    return (
      <Form
        disabled={disabled}
        initialValues={{
          name,
          fulfillments: deepRemoveKeyByRegex(fulfillments, /^__/),
          rewards: deepRemoveKeyByRegex(rewards, /^__/),
          startDate,
          endDate,
        }}
        fulfillments={fulfillments}
        form="settings"
        onSubmit={this.handleUpdateCampaign}
      />
    );
  }
}

export default SettingsView;
