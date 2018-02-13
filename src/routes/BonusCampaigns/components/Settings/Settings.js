import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SubmissionError, change as formChange } from 'redux-form';
import { get } from 'lodash';
import Form from './Form';
import { statuses } from '../../../../constants/bonus-campaigns';
import PropTypes from '../../../../constants/propTypes';
import { statuses as freeSpinTemplateStatuses } from '../../../../constants/free-spin-template';
import CurrencyCalculationModal from '../../components/CurrencyCalculationModal';
import AddToCampaignModal from '../../../../components/AddToCampaignModal';
import { customValueFieldTypes } from '../../../../constants/form';

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
      bonusLifetime: PropTypes.bonusCampaignEntity.bonusLifetime,
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
    providers: PropTypes.array,
    templates: PropTypes.array,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    fetchCampaigns: PropTypes.func.isRequired,
    fetchCampaign: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchPaymentMethods: PropTypes.func.isRequired,
    createFreeSpinTemplate: PropTypes.func.isRequired,
    paymentMethods: PropTypes.array.isRequired,
    form: PropTypes.string.isRequired,
  };

  static defaultProps = {
    games: [],
    providers: [],
    templates: [],
    bonusCampaignForm: {
      capping: {
        type: customValueFieldTypes.ABSOLUTE,
      },
      conversionPrize: {
        type: customValueFieldTypes.ABSOLUTE,
      },
    },
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
        if (status === freeSpinTemplateStatuses.CREATED) {
          this.stopPollingFreeSpinTemplate();
          resolve();
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
    const { fetchCampaign } = this.props;

    const action = await fetchCampaign(data.campaignUuid);
    if (action && !action.error) {
      this.setLinkedCampaignData(action.payload);
    }

    this.change('linkedCampaignUUID', data.campaignUuid);
    this.handleCloseModal(CHOOSE_CAMPAIGN_MODAL);
  };

  change = (field, value) => {
    const { form } = this.props;

    formChange(form, field, value);
  };

  handleSubmit = async (formData) => {
    const { createFreeSpinTemplate, handleSubmit } = this.props;

    let data = { ...formData };
    const rewardsFreeSpin = get(data, 'rewards.freeSpin');

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
          await this.startPollingFreeSpinTemplate(rewardsFreeSpinData.templateUUID);
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

    return handleSubmit(data);
  };

  render() {
    const { modal, linkedCampaign } = this.state;
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
      fetchPaymentMethods,
      form,
      paymentMethods,
    } = this.props;

    return (
      <div>
        <Form
          locale={locale}
          currencies={currencies}
          disabled={bonusCampaign.state !== statuses.DRAFT}
          initialValues={{ optIn: true, ...bonusCampaignForm }}
          removeNode={removeNode}
          addNode={addNode}
          nodeGroups={nodeGroups}
          revert={revert}
          onSubmit={this.handleSubmit}
          toggleModal={this.handleCurrencyAmountModalOpen}
          games={games}
          providers={providers}
          templates={templates}
          form={form}
          fetchFreeSpinTemplate={fetchFreeSpinTemplate}
          fetchFreeSpinTemplates={fetchFreeSpinTemplates}
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

export default Settings;
