import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, isEqual } from 'lodash';
import { v4 } from 'uuid';
import PropTypes from '../../../../../../../constants/propTypes';
import Form from '../../../../../components/Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import asyncForEach from '../../../../../../../utils/asyncForEach';
import { fulfillmentTypes, rewardTemplateTypes } from '../../../../../constants';
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
    brandId: PropTypes.string.isRequired,
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
      addGamingFulfillment,
      updateDepositFulfillment,
      updateGamingFulfillment,
      createOrLinkTag,
      campaign: {
        campaign: {
          data: {
            fulfillments: initialFulfillments,
          },
          data,
        },
      },
      brandId,
    } = this.props;
    const formData = Object.keys(values).reduce((res, key) => ({
      ...res,
      [key]: (values[key] || typeof values[key] === 'boolean') ? values[key] : undefined,
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
      } else if (type === fulfillmentTypes.GAMING) {
        const response = await addGamingFulfillment({
          variables: {
            ...fulfillment,
            brandId,
          },
        });

        uuid = get(response, 'data.gamingFulfillment.add.data.uuid');
      }

      if (uuid) {
        fulfillments.push(uuid);
      }
    });

    const currentDepositFulfillments = formData.fulfillments
      .filter(({ type, uuid }) => type === fulfillmentTypes.DEPOSIT && uuid);

    await asyncForEach(currentDepositFulfillments, async (currentDepositFulfillment) => {
      const initialDepositFulfillment = initialFulfillments.find(({ uuid }) => uuid === currentDepositFulfillment.uuid);

      if (!isEqual(initialDepositFulfillment, currentDepositFulfillment)) {
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

    const currentGamingFulfillments = formData.fulfillments
      .filter(({ type, uuid }) => type === fulfillmentTypes.GAMING && uuid);

    await asyncForEach(currentGamingFulfillments, async (currentGamingFulfillment) => {
      const initialGamingFulfillment = initialFulfillments.find(({ uuid }) => uuid === currentGamingFulfillment.uuid);

      if (!isEqual(initialGamingFulfillment, currentGamingFulfillment)) {
        await updateGamingFulfillment({
          variables: currentGamingFulfillment,
        });
      }
    });

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
    const action = await updateCampaign({
      variables: {
        ...formData,
        uuid: data.uuid,
        rewards,
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
