import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, isEqual } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import Form from '../../../../../components/Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import asyncForEach from '../../../../../../../utils/asyncForEach';
import { fulfillmentTypes } from '../../../../../constants';
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

  handleUpdateCampaign = async (values) => {
    const {
      updateCampaign,
      notify,
      addWageringFulfillment,
      addDepositFulfillment,
      updateDepositFulfillment,
      campaign: {
        campaign: {
          data: {
            fulfillments: initialFulfillments,
          },
          data,
        },
      },
    } = this.props;
    const formData = Object.keys(values).reduce((res, key) => ({
      ...res,
      [key]: values[key] !== '' ? values[key] : undefined,
    }), {});

    const fulfillments = formData.fulfillments
      .filter(({ uuid }) => uuid)
      .map(({ uuid }) => uuid);
    const newFulfillments = formData.fulfillments.filter(({ uuid }) => !uuid);

    await asyncForEach(newFulfillments, async ({ type, ...fulfillment }) => {
      let uuid = null;

      if (type === fulfillmentTypes.WAGERING) {
        const response = await addWageringFulfillment({ variables: fulfillment });

        uuid = get(response, 'data.wageringFulfillment.add.data.uuid');
      } else if (type === fulfillmentTypes.DEPOSIT) {
        const response = await addDepositFulfillment({ variables: fulfillment });

        uuid = get(response, 'data.depositFulfillment.add.data.uuid');
      }

      if (uuid) {
        fulfillments.push(uuid);
      }
    });

    const currentDepositFulfillments = formData.fulfillments
      .filter(({ type, uuid }) => type === fulfillmentTypes.DEPOSIT && uuid);

    await asyncForEach(currentDepositFulfillments, async (currentDepositFulfillment) => {
      const initialFulfillment = initialFulfillments.find(({ uuid }) => uuid === currentDepositFulfillment.uuid);

      if (!isEqual(initialFulfillment, currentDepositFulfillment)) {
        const {
          minAmount, maxAmount, numDeposit, excludedPaymentMethods, uuid,
        } = currentDepositFulfillment;

        await updateDepositFulfillment({
          variables: {
            minAmount, maxAmount, numDeposit, excludedPaymentMethods, uuid,
          },
        });
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
            targetType,
            optIn,
            state,
            fulfillments,
            rewards,
            startDate,
            endDate,
            promoCode,
            optInPeriod,
            optInPeriodTimeUnit,
            countries,
            excludeCountries,
            fulfillmentPeriod,
            fulfillmentPeriodTimeUnit,
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
          targetType,
          optIn,
          fulfillments: deepRemoveKeyByRegex(fulfillments, /^__/),
          rewards: deepRemoveKeyByRegex(rewards, /^__/),
          startDate,
          endDate,
          countries,
          excludeCountries,
          promoCode,
          optInPeriod,
          optInPeriodTimeUnit,
          fulfillmentPeriod,
          fulfillmentPeriodTimeUnit,
        }}
        fulfillments={fulfillments}
        form="settings"
        onSubmit={this.handleUpdateCampaign}
      />
    );
  }
}

export default SettingsView;
