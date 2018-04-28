import { connect } from 'react-redux';
import Settings from '../Settings';
import { actionCreators } from '../../../modules';
import { actionCreators as templateActionCreators } from '../../../modules/freeSpinTemplates';
import { actionCreators as bonusTemplateActionCreators } from '../../../modules/bonusTemplates';
import { actionCreators as gamesActionCreators } from '../../../modules/games';
import { actionCreators as campaignsActionCreators } from '../../../modules/campaigns';
import { actionCreators as paymentsActionCreators } from '../../../modules/payments';

const mapStateToProps = ({
  bonusCampaignCreate: {
    create: { data, nodeGroups },
    games: { games },
    freeSpinTemplates: { data: freeSpinTemplates },
    bonusTemplates: { data: bonusTemplates },
    payments: { list: paymentMethods },
    options: { data: aggregators },
  },
  options: { data: { currencyCodes, baseCurrency } },
  i18n: { locale },
}) => ({
  bonusCampaign: data,
  nodeGroups,
  currencies: currencyCodes,
  baseCurrency,
  games,
  freeSpinTemplates,
  bonusTemplates,
  locale,
  paymentMethods,
  aggregators,
});

const mapActions = {
  createCampaign: actionCreators.createCampaign,
  revert: actionCreators.revert,
  removeNode: actionCreators.removeNode,
  addNode: actionCreators.addNode,
  addFreeSpinTemplate: templateActionCreators.addFreeSpinTemplate,
  createFreeSpinTemplate: templateActionCreators.createFreeSpinTemplate,
  fetchFreeSpinTemplates: templateActionCreators.fetchFreeSpinTemplates,
  fetchFreeSpinTemplate: templateActionCreators.fetchFreeSpinTemplate,
  addBonusTemplate: bonusTemplateActionCreators.addBonusTemplate,
  createBonusTemplate: bonusTemplateActionCreators.createBonusTemplate,
  fetchBonusTemplates: bonusTemplateActionCreators.fetchBonusTemplates,
  fetchBonusTemplate: bonusTemplateActionCreators.fetchBonusTemplate,
  fetchGames: gamesActionCreators.fetchGames,
  fetchCampaigns: campaignsActionCreators.fetchCampaigns,
  fetchCampaign: campaignsActionCreators.fetchCampaign,
  fetchPaymentMethods: paymentsActionCreators.fetchPaymentMethods,
  resetAllNodes: actionCreators.resetAllNodes,
  fetchGameAggregators: actionCreators.fetchGameAggregators,
};

export default connect(mapStateToProps, mapActions)(Settings);
