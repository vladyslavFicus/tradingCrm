import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import _ from 'lodash';
import Form from './Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import PropTypes from '../../../../../../../constants/propTypes';
import CurrencyCalculationModal from '../../../../../components/CurrencyCalculationModal';

const CURRENCY_AMOUNT_MODAL = 'currency-amount-modal';
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
  };

  static defaultProps = {
    games: [],
    providers: [],
    templates: [],
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
  };

  handleCurrencyAmountModalOpen = (action) => {
    this.handleOpenModal(CURRENCY_AMOUNT_MODAL, {
      initialValues: {
        action: action.action,
        reasons: action.reasons,
      },
      ...action,
    });
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleModalHide = (e, callback) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
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
        const createAction = await createFreeSpinTemplate(rewardsFreeSpin);

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
        throw new SubmissionError({ __error: I18n.t(updateAction.payload.response.error) });
      }
    }

    return updateAction;
  };

  render() {
    const { modal } = this.state;
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
      fetchFreeSpinTemplate,
      fetchFreeSpinTemplates,
      fetchGames,
    } = this.props;

    return (
      <div>
        <Form
          locale={locale}
          currencies={currencies}
          disabled={bonusCampaign.state !== statuses.DRAFT}
          initialValues={bonusCampaignForm}
          removeNode={removeNode}
          addNode={addNode}
          nodeGroups={nodeGroups}
          revert={revert}
          onSubmit={this.handleSubmit}
          toggleModal={this.handleCurrencyAmountModalOpen}
          games={games}
          providers={providers}
          templates={templates}
          fetchFreeSpinTemplate={fetchFreeSpinTemplate}
          fetchFreeSpinTemplates={fetchFreeSpinTemplates}
          fetchGames={fetchGames}
        />
        {
          modal.name === CURRENCY_AMOUNT_MODAL &&
          <CurrencyCalculationModal
            {...modal.params}
            onHide={this.handleModalHide}
          />
        }
      </div>
    );
  }
}

export default View;
