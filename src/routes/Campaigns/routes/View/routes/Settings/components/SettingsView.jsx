import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, isEqual, pickBy, omit } from 'lodash';
import PropTypes from '../../../../../../../constants/propTypes';
import Form from '../../../../../components/Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import asyncForEach from '../../../../../../../utils/asyncForEach';
import { fulfillmentTypes, rewardTemplateTypes } from '../../../../../constants';
import Permissions from '../../../../../../../utils/permissions';
import permissions from '../../../../../../../config/permissions';
import deepRemoveKeyByRegex from '../../../../../../../utils/deepKeyPrefixRemove';
import { deviceTypes } from '../../../../../components/Rewards/constants';

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

  isCampaignPristine(currentData) {
    const {
      campaign: {
        campaign: {
          data: initialData,
          data: {
            fulfillments: initialFulfillments,
          },
        },
      },
    } = this.props;

    if (!isEqual(currentData.fulfillments.map(f => f.uuid), initialFulfillments.map(f => f.uuid))) {
      return false;
    }

    const excludeFields = [
      'uuid',
      'authorUUID',
      'creationDate',
      'state',
      'fulfillments',
      '__typename',
      '_id',
    ];

    return isEqual(
      pickBy(omit(initialData, excludeFields)),
      pickBy(omit(currentData, excludeFields))
    );
  }

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
            tags: initialTags,
          },
          data,
        },
      },
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
          variables: fulfillment,
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

    const rewards = await Promise.all(formData.rewards.map(async ({ uuid, deviceType, type, tagName: tagNames }) => {
      let tempUUID = uuid;
      if (!uuid && type === rewardTemplateTypes.TAG) {
        const [tagName] = tagNames;

        const result = await createOrLinkTag({ variables: { tagName } });
        const { data: responseData } = get(result, 'data.tag.createOrLink', { data: '', error: '' });

        if (responseData) {
          tempUUID = responseData[0].tagId;
        }
      }

      return {
        uuid: tempUUID,
        type: deviceType || deviceTypes.ALL,
      };
    }));

    const tags = formData.tags.map(currentTag => ({
      tagId: initialTags
        ? get(initialTags.find(initialTag => initialTag.tagName === currentTag), 'tagId')
        : undefined,
      tagName: currentTag,
    }));

    const tagsToUpdate = await Promise.all(tags.map(async ({ tagId, tagName }) => {
      let tempUUID = tagId;

      if (!tagId) {
        const result = await createOrLinkTag({ variables: { tagName, targetUUID: data.uuid } });

        const { data: responseData } = get(result, 'data.tag.createOrLink', { data: [], error: '' });

        if (responseData) {
          tempUUID = responseData[0].tagId;
        }
      }

      return {
        uuid: tempUUID,
      };
    }));

    if (!this.isCampaignPristine(formData)) {
      const action = await updateCampaign({
        variables: {
          ...formData,
          uuid: data.uuid,
          rewards,
          fulfillments,
          tags: tagsToUpdate.map(v => v.uuid),
        },
      });

      const error = get(action, 'data.campaign.update.error');

      notify({
        level: error ? 'error' : 'success',
        title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.UPDATE_TITLE'),
        message: I18n.t(`CAMPAIGNS.VIEW.NOTIFICATIONS.${error ? 'UNSUCCESSFULLY' : 'SUCCESSFULLY'}`),
      });
    }
  };

  render() {
    const {
      campaign: {
        campaign: {
          data: {
            name,
            targetType,
            optIn,
            tags,
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
          tags: tags.map(t => t.tagName),
        }}
        fulfillments={fulfillments}
        form="settings"
        onSubmit={this.handleUpdateCampaign}
      />
    );
  }
}

export default SettingsView;
