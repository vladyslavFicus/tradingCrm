import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
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
      campaignType: PropTypes.bonusCampaignEntity.campaignType,
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
    nodeGroups: PropTypes.shape({
      fulfillments: PropTypes.array.isRequired,
      rewards: PropTypes.array.isRequired,
    }).isRequired,
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

  handleSubmit = async (data) => {
    const { params, updateCampaign } = this.props;
    const action = await updateCampaign(params.id, data);

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.UPDATE_TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      if (action.error && action.payload.response.fields_errors) {
        const errors = Object.keys(action.payload.response.fields_errors).reduce((res, name) => ({
          ...res,
          [name]: I18n.t(action.payload.response.fields_errors[name].error),
        }), {});
        throw new SubmissionError(errors);
      } else if (action.payload.response && action.payload.response.error) {
        throw new SubmissionError({ __error: I18n.t(action.payload.response.error) });
      }
    }

    return action;
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
