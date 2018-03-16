import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { SubmissionError, change } from 'redux-form';
import { get } from 'lodash';
import Form from './Form';
import { statuses } from '../../../../constants/bonus-campaigns';
import PropTypes from '../../../../constants/propTypes';
import { statuses as freeSpinTemplateStatuses } from '../../../../constants/free-spin-template';
import CurrencyCalculationModal from '../../components/CurrencyCalculationModal';
import recognizeFieldError from '../../../../utils/recognizeFieldError';
import AddToCampaignModal from '../../../../components/AddToCampaignModal';
import { customValueFieldTypes } from '../../../../constants/form';
import { mapResponseErrorToField } from './constants';

const CURRENCY_AMOUNT_MODAL = 'currency-amount-modal';
const CHOOSE_CAMPAIGN_MODAL = 'choose-campaign-modal';
const POLLING_FREE_SPIN_TEMPLATE_INTERVAL = 1000;
const modalInitialState = {
  name: null,
  params: {},
};

class Settings extends Component {
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
      bonusLifeTime: PropTypes.bonusCampaignEntity.bonusLifeTime,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      capping: PropTypes.bonusCampaignEntity.capping,
      optIn: PropTypes.bonusCampaignEntity.optIn,
      fulfilmentType: PropTypes.bonusCampaignEntity.fulfilmentType,
      minAmount: PropTypes.bonusCampaignEntity.minAmount,
      maxAmount: PropTypes.bonusCampaignEntity.maxAmount,
    }),
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    locale: PropTypes.string.isRequired,
    revert: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    nodeGroups: PropTypes.shape({
      fulfillments: PropTypes.array.isRequired,
      rewards: PropTypes.array.isRequired,
    }).isRequired,
    games: PropTypes.array,
    freeSpinTemplates: PropTypes.array,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    fetchCampaigns: PropTypes.func.isRequired,
    fetchCampaign: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchPaymentMethods: PropTypes.func.isRequired,
    createFreeSpinTemplate: PropTypes.func.isRequired,
    createBonusTemplate: PropTypes.func.isRequired,
    paymentMethods: PropTypes.array.isRequired,
    form: PropTypes.string.isRequired,
    baseCurrency: PropTypes.string.isRequired,
    changeForm: PropTypes.func.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    bonusTemplates: PropTypes.arrayOf(PropTypes.bonusTemplateListEntity),
  };

  static defaultProps = {
    games: [],
    freeSpinTemplates: [],
    bonusCampaignForm: {
      capping: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      conversionPrize: {
        type: customValueFieldTypes.ABSOLUTE,
      },
    },
    bonusTemplates: [],
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    linkedCampaign: null,
  };

  async componentDidMount() {
    const { bonusCampaignForm: { linkedCampaignUUID }, fetchCampaign } = this.props;

    if (linkedCampaignUUID) {
      const action = await fetchCampaign(linkedCampaignUUID);

      if (action && !action.error) {
        this.setLinkedCampaignData(action.payload);
      }
    }
  }

  componentWillUnmount() {
    if (this.pollingFreeSpinTemplate) {
      this.stopPollingFreeSpinTemplate();
    }
  }

  setLinkedCampaignData = linkedCampaign => this.setState({ linkedCampaign });

  pollingFreeSpinTemplate = null;

  startPollingFreeSpinTemplate = uuid => new Promise((resolve) => {
    this.pollingFreeSpinTemplate = setInterval(async () => {
      const action = await this.props.fetchFreeSpinTemplate(uuid);

      if (action && !action.error) {
        const { status } = action.payload;
        if (status === freeSpinTemplateStatuses.CREATED || status === freeSpinTemplateStatuses.FAILED) {
          this.stopPollingFreeSpinTemplate();
          resolve({ success: status === freeSpinTemplateStatuses.CREATED });
        }
      }
    }, POLLING_FREE_SPIN_TEMPLATE_INTERVAL);
  });

  stopPollingFreeSpinTemplate = () => {
    clearInterval(this.pollingFreeSpinTemplate);
    this.pollingFreeSpinTemplate = null;
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

  handleCloseModal = (e, callback) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleClickChooseCampaign = async () => {
    const action = await this.props.fetchCampaigns();

    if (action && !action.error) {
      this.handleOpenModal(CHOOSE_CAMPAIGN_MODAL, {
        campaigns: action.payload.content,
      });
    }
  };

  handleSubmitLinkedCampaign = async (data) => {
    const { fetchCampaign, changeForm } = this.props;

    const action = await fetchCampaign(data.campaignUuid);
    if (action && !action.error) {
      this.setLinkedCampaignData(action.payload);
    }

    changeForm('linkedCampaignUUID', data.campaignUuid);
    this.handleCloseModal(CHOOSE_CAMPAIGN_MODAL);
  };

  handleSubmit = async (formData) => {
    const {
      createFreeSpinTemplate,
      createBonusTemplate,
      handleSubmit,
    } = this.props;

    const { currency } = formData;

    let data = { ...formData };
    let rewardsFreeSpin = get(data, 'rewards.freeSpin');

    if (rewardsFreeSpin) {
      if (rewardsFreeSpin.betPerLine) {
        rewardsFreeSpin = {
          ...rewardsFreeSpin,
          betPerLineAmounts: [
            {
              amount: rewardsFreeSpin.betPerLine,
              currency,
            },
          ],
        };
        delete rewardsFreeSpin.betPerLine;
      }

      let bonus = get(rewardsFreeSpin, 'bonus');
      if (bonus) {
        data = {
          ...data,
          claimable: get(bonus, 'claimable', false),
          wagerWinMultiplier: bonus.wageringRequirement.value,
          bonusLifeTime: bonus.bonusLifeTime,
        };

        if (bonus.templateUUID) {
          rewardsFreeSpin.bonusTemplateUUID = bonus.templateUUID;
        } else {
          if (bonus.maxBet) {
            bonus = {
              ...bonus,
              maxBet: {
                currencies: [{
                  amount: bonus.maxBet,
                  currency,
                }],
              },
            };
          }

          if (
            bonus.maxGrantAmount &&
            bonus.grantRatio &&
            bonus.grantRatio.type === customValueFieldTypes.PERCENTAGE
          ) {
            bonus = {
              ...bonus,
              maxGrantAmount: {
                currencies: [{
                  amount: bonus.maxGrantAmount,
                  currency,
                }],
              },
            };
          } else {
            delete bonus.maxGrantAmount;
          }

          ['wageringRequirement', 'grantRatio', 'capping', 'prize'].forEach((key) => {
            if (bonus[key]) {
              if (bonus[key].value) {
                const value = bonus[key].type === customValueFieldTypes.ABSOLUTE ? {
                  value: {
                    currencies: [{
                      amount: bonus[key].value,
                      currency,
                    }],
                  },
                } : {
                  percentage: bonus[key].value,
                };

                bonus = {
                  ...bonus,
                  [key]: {
                    ratioType: bonus[key].type,
                    ...value,
                  },
                };
              } else {
                delete bonus[key];
              }
            }
          });

          const action = await createBonusTemplate({
            claimable: false,
            ...bonus,
          });

          if (action && !action.error) {
            rewardsFreeSpin.bonusTemplateUUID = action.payload.uuid;
          } else if (action.payload.response && action.payload.response.error) {
            const fieldErrors = recognizeFieldError(action.payload.response.error, mapResponseErrorToField);
            if (fieldErrors) {
              throw new SubmissionError({
                rewards: {
                  freeSpin: {
                    bonus: fieldErrors,
                  },
                },
              });
            } else {
              throw new SubmissionError({ __error: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS_TEMPLATE.CREATION_ERROR') });
            }
          }
        }
      }

      let rewardsFreeSpinData = {};

      if (rewardsFreeSpin.templateUUID) {
        rewardsFreeSpinData = rewardsFreeSpin;
      } else {
        const createAction = await createFreeSpinTemplate(rewardsFreeSpin);

        if (createAction && !createAction.error) {
          rewardsFreeSpinData.templateUUID = createAction.payload.uuid;
          const polling = await this.startPollingFreeSpinTemplate(rewardsFreeSpinData.templateUUID);
          if (!polling.success) {
            this.context.addNotification({
              level: 'error',
              title: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CREATION_ERROR'),
            });
            throw new SubmissionError({ __error: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CREATION_ERROR') });
          }
        } else if (get(createAction, 'payload.response.fields_errors', false)) {
          const errors = Object.keys(createAction.payload.response.fields_errors).reduce((res, name) => ({
            ...res,
            [name]: I18n.t(createAction.payload.response.fields_errors[name].error),
          }), {});
          throw new SubmissionError(errors);
        } else if (createAction.payload.response && createAction.payload.response.error) {
          const fieldErrors = recognizeFieldError(createAction.payload.response.error, mapResponseErrorToField);
          if (fieldErrors) {
            throw new SubmissionError({
              rewards: {
                freeSpin: fieldErrors,
              },
            });
          } else {
            throw new SubmissionError({ __error: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CREATION_ERROR') });
          }
        }
      }

      data = {
        ...data,
        ...rewardsFreeSpinData,
      };
    }

    return handleSubmit(data);
  };

  render() {
    const { modal, linkedCampaign } = this.state;
    const {
      bonusCampaign,
      bonusCampaignForm,
      currencies,
      baseCurrency,
      locale,
      revert,
      nodeGroups,
      removeNode,
      addNode,
      games,
      freeSpinTemplates,
      bonusTemplates,
      fetchFreeSpinTemplate,
      fetchFreeSpinTemplates,
      fetchBonusTemplates,
      fetchBonusTemplate,
      fetchGames,
      fetchPaymentMethods,
      form,
      paymentMethods,
    } = this.props;

    return (
      <div>
        <Form
          locale={locale}
          currencies={currencies}
          baseCurrency={baseCurrency}
          disabled={bonusCampaign.state !== statuses.DRAFT}
          initialValues={{ optIn: true, ...bonusCampaignForm }}
          removeNode={removeNode}
          addNode={addNode}
          nodeGroups={nodeGroups}
          revert={revert}
          onSubmit={this.handleSubmit}
          toggleModal={this.handleCurrencyAmountModalOpen}
          games={games}
          freeSpinTemplates={freeSpinTemplates}
          bonusTemplates={bonusTemplates}
          form={form}
          fetchFreeSpinTemplate={fetchFreeSpinTemplate}
          fetchFreeSpinTemplates={fetchFreeSpinTemplates}
          fetchBonusTemplates={fetchBonusTemplates}
          fetchBonusTemplate={fetchBonusTemplate}
          fetchGames={fetchGames}
          handleClickChooseCampaign={this.handleClickChooseCampaign}
          linkedCampaign={linkedCampaign}
          fetchPaymentMethods={fetchPaymentMethods}
          paymentMethods={paymentMethods}
        />
        {
          modal.name === CURRENCY_AMOUNT_MODAL &&
          <CurrencyCalculationModal
            {...modal.params}
            onHide={this.handleCloseModal}
          />
        }
        {
          modal.name === CHOOSE_CAMPAIGN_MODAL &&
          <AddToCampaignModal
            {...modal.params}
            onClose={this.handleCloseModal}
            onSubmit={this.handleSubmitLinkedCampaign}
            title={I18n.t('BONUS_CAMPAIGNS.SETTINGS.MODAL.CHOOSE_CAMPAIGN.TITLE')}
            message={I18n.t('BONUS_CAMPAIGNS.SETTINGS.MODAL.CHOOSE_CAMPAIGN.MESSAGE')}
          />
        }
      </div>
    );
  }
}

export default connect(null, (dispatch, { form }) => ({
  changeForm: (field, value) => dispatch(change(form, field, value)),
})
)(Settings);
