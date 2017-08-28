import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import Form from './Form';
import { statuses } from '../../../../../../../constants/bonus-campaigns';
import PropTypes from '../../../../../../../constants/propTypes';
import { customValueFieldTypes } from '../../../../../../../constants/form';
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
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    updateCampaign: PropTypes.func.isRequired,
    locale: PropTypes.string,
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

  handleSubmitModal = ({ reason, action }) => {
    this.handleModalHide(null, () => this.props.onChange({ id: this.props.campaign.id, reason, action }));
  };

  handleSubmit = async (data) => {
    const action = await this.props.updateCampaign(this.props.params.id, data);

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
    const { bonusCampaign, currencies, locale } = this.props;

    return (
      <div>
        <Form
          locale={locale}
          currencies={currencies}
          disabled={bonusCampaign.state !== statuses.DRAFT}
          initialValues={{
            campaignName: bonusCampaign.campaignName,
            campaignPriority: bonusCampaign.campaignPriority,
            targetType: bonusCampaign.targetType,
            currency: bonusCampaign.currency,
            startDate: bonusCampaign.startDate,
            endDate: bonusCampaign.endDate,
            wagerWinMultiplier: bonusCampaign.wagerWinMultiplier,
            bonusLifetime: bonusCampaign.bonusLifetime,
            campaignRatio: bonusCampaign.campaignRatio,
            conversionPrize: bonusCampaign.conversionPrize || {
              value: null,
              type: customValueFieldTypes.ABSOLUTE,
            },
            capping: bonusCampaign.capping || {
              value: null,
              type: customValueFieldTypes.ABSOLUTE,
            },
            optIn: bonusCampaign.optIn,
            campaignType: bonusCampaign.campaignType,
            minAmount: bonusCampaign.minAmount,
            maxAmount: bonusCampaign.maxAmount,
          }}
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
