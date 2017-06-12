import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError } from 'redux-form';
import Form from './Form';
import { statuses } from '../../../../../constants';
import PropTypes from '../../../../../../../constants/propTypes';

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
    const { bonusCampaign, currencies, locale } = this.props;

    return (
      <div className="player__account__page_profile tab-content padding-vertical-20">
        <div className="tab-pane active" role="tabpanel">
          <div className="panel-body row">
            <div className="col-md-10">
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
                  conversionPrize: bonusCampaign.conversionPrize,
                  capping: bonusCampaign.capping,
                  optIn: bonusCampaign.optIn,
                  campaignType: bonusCampaign.campaignType,
                  minAmount: bonusCampaign.minAmount,
                  maxAmount: bonusCampaign.maxAmount,
                }}
                onSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default View;
