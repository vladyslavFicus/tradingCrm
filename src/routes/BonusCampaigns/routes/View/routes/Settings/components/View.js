import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import Form from './Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import PropTypes from '../../../../../../../constants/propTypes';
import CurrencyCalculationModal from '../../../../../components/CurrencyCalculationModal';

const initialState = {
  modal: {
    show: false,
    params: {},
  },
};

class View extends Component {
  static propTypes = {
    bonusCampaign: PropTypes.bonusCampaignEntity.isRequired,
    bonusCampaignForm: PropTypes.shape({
      campaignName: PropTypes.bonusCampaignEntity.campaignName,
      campaignPriority: PropTypes.bonusCampaignEntity.campaignPriority,
      targetType: PropTypes.bonusCampaignEntity.targetType,
      currency: PropTypes.bonusCampaignEntity.currency,
      startDate: PropTypes.bonusCampaignEntity.startDate,
      endDate: PropTypes.bonusCampaignEntity.endDate,
      wagerWinMultiplier: PropTypes.bonusCampaignEntity.wagerWinMultiplier,
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
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = { ...initialState };

  handleModalOpen = (action) => {
    this.setState({
      modal: {
        show: true,
        params: {
          initialValues: {
            action: action.action,
            reasons: action.reasons,
          },
          ...action,
        },
      },
    });
  };

  handleModalHide = (e, callback) => {
    this.setState({
      modal: { ...initialState.modal },
    }, () => {
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
          [name]: action.payload.response.fields_errors[name].error,
        }), {});
        throw new SubmissionError(errors);
      } else if (action.payload.response && action.payload.response.error) {
        throw new SubmissionError({ __error: action.payload.response.error });
      }
    }

    return action;
  };

  render() {
    const { modal } = this.state;
    const { bonusCampaign, bonusCampaignForm, currencies, locale } = this.props;

    return (
      <div >
        <Form
          locale={locale}
          currencies={currencies}
          disabled={bonusCampaign.state !== statuses.DRAFT}
          initialValues={bonusCampaignForm}
          onSubmit={this.handleSubmit}
          toggleModal={this.handleModalOpen}
        />
        {
          modal.show &&
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
