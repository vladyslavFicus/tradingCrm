import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import _ from 'lodash';
import Settings from '../../../../../components/Settings';
import PropTypes from '../../../../../../../constants/propTypes';

const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    bonusCampaign: PropTypes.bonusCampaignEntity.isRequired,
    bonusCampaignForm: PropTypes.shape({
      campaignName: PropTypes.bonusCampaignEntity.campaignName,
      targetType: PropTypes.bonusCampaignEntity.targetType,
      currency: PropTypes.bonusCampaignEntity.currency,
      startDate: PropTypes.bonusCampaignEntity.startDate,
      endDate: PropTypes.bonusCampaignEntity.endDate,
      wagerWinMultiplier: PropTypes.bonusCampaignEntity.wagerWinMultiplier,
      promoCode: PropTypes.bonusCampaignEntity.promoCode,
      bonusLifetime: PropTypes.bonusCampaignEntity.bonusLifetime,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      capping: PropTypes.bonusCampaignEntity.capping,
      optIn: PropTypes.bonusCampaignEntity.optIn,
      fulfilmentType: PropTypes.bonusCampaignEntity.fulfilmentType,
      minAmount: PropTypes.bonusCampaignEntity.minAmount,
      maxAmount: PropTypes.bonusCampaignEntity.maxAmount,
    }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    updateCampaign: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    revert: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    createFreeSpinTemplate: PropTypes.func.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    nodeGroups: PropTypes.shape({
      fulfillments: PropTypes.array.isRequired,
      rewards: PropTypes.array.isRequired,
    }).isRequired,
    games: PropTypes.array,
    providers: PropTypes.array,
    templates: PropTypes.array,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    fetchCampaigns: PropTypes.func.isRequired,
    fetchCampaign: PropTypes.func.isRequired,
    paymentMethods: PropTypes.array.isRequired,
    fetchPaymentMethods: PropTypes.func.isRequired,
  };

  static defaultProps = {
    games: [],
    providers: [],
    templates: [],
    paymentMethods: [],
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    linkedCampaign: null,
  };


  handleSubmit = async (formData) => {
    let data = { ...formData };

    const { params, updateCampaign, createFreeSpinTemplate } = this.props;

    const rewardsFreeSpin = _.get(data, 'rewards.freeSpin');
    if (rewardsFreeSpin) {
      let rewardsFreeSpinData = {};

      if (rewardsFreeSpin.templateUUID) {
        rewardsFreeSpinData = rewardsFreeSpin;
      } else {
        const createAction = await createFreeSpinTemplate({
          claimable: false,
          ...rewardsFreeSpin,
        });

        if (createAction && !createAction.error) {
          rewardsFreeSpinData = createAction.payload;
        } else {
          throw new SubmissionError({
            rewards: {
              freeSpin: {
                name: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.NAME_ALREADY_EXIST'),
              },
            },
          });
        }
      }

      data = {
        ...data,
        ...rewardsFreeSpinData,
      };
    }

    const updateAction = await updateCampaign(params.id, data);

    if (updateAction) {
      this.context.addNotification({
        level: updateAction.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.UPDATE_TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${updateAction.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      if (updateAction.error && updateAction.payload.response.fields_errors) {
        const errors = Object.keys(updateAction.payload.response.fields_errors).reduce((res, name) => ({
          ...res,
          [name]: I18n.t(updateAction.payload.response.fields_errors[name].error),
        }), {});
        throw new SubmissionError(errors);
      } else if (updateAction.payload.response && updateAction.payload.response.error) {
        const fieldError = recognizeFieldError(updateAction.payload.response.error, mapResponseErrorToField);
        if (fieldError) {
          throw new SubmissionError(fieldError);
        } else {
          throw new SubmissionError({ __error: I18n.t(updateAction.payload.response.error) });
        }
      }
    }

    return updateAction;
  };


  render() {
    const {
      bonusCampaign,
      bonusCampaignForm,
      currencies,
      locale,
      revert,
      nodeGroups,
      removeNode,
      addNode,
      games,
      providers,
      templates,
      paymentMethods,
      fetchFreeSpinTemplate,
      fetchFreeSpinTemplates,
      fetchGames,
      fetchPaymentMethods,
      fetchCampaigns,
      fetchCampaign,
      change,
    } = this.props;

    return (
      <Settings
        fetchGames={fetchGames}
        fetchPaymentMethods={fetchPaymentMethods}
        paymentMethods={paymentMethods}
        fetchFreeSpinTemplates={fetchFreeSpinTemplates}
        fetchFreeSpinTemplate={fetchFreeSpinTemplate}
        templates={templates}
        providers={providers}
        games={games}
        fetchCampaigns={fetchCampaigns}
        fetchCampaign={fetchCampaign}
        handleSubmit={this.handleSubmit}
        addNode={addNode}
        removeNode={removeNode}
        nodeGroups={nodeGroups}
        revert={revert}
        bonusCampaign={bonusCampaign}
        bonusCampaignForm={bonusCampaignForm}
        locale={locale}
        currencies={currencies}
        change={change}
      />
    );
  }
}

export default View;
