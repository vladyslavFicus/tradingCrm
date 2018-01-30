import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import Form from './Form';
import { statuses } from '../../../../../constants/bonus-campaigns';
import PropTypes from '../../../../../constants/propTypes';
import CurrencyCalculationModal from '../../../components/CurrencyCalculationModal';
import AddToCampaignModal from '../../../../../components/AddToCampaignModal';

const CURRENCY_AMOUNT_MODAL = 'currency-amount-modal';
const CHOOSE_CAMPAIGN_MODAL = 'choose-campaign-modal';
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

  setLinkedCampaignData = linkedCampaign => this.setState({ linkedCampaign });

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
    const { fetchCampaign, change } = this.props;

    const action = await fetchCampaign(data.campaignUuid);
    if (action && !action.error) {
      this.setLinkedCampaignData(action.payload);
    }

    change('linkedCampaignUUID', data.campaignUuid);
    this.handleCloseModal(CHOOSE_CAMPAIGN_MODAL);
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
      handleSubmit,
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
          onSubmit={handleSubmit}
          toggleModal={this.handleCurrencyAmountModalOpen}
          games={games}
          providers={providers}
          templates={templates}
          fetchFreeSpinTemplate={fetchFreeSpinTemplate}
          fetchFreeSpinTemplates={fetchFreeSpinTemplates}
          fetchGames={fetchGames}
          handleClickChooseCampaign={this.handleClickChooseCampaign}
          linkedCampaign={linkedCampaign}
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

export default View;
