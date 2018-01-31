import { connect } from 'react-redux';
import { change } from 'redux-form';
import Settings from '../Settings';
import { FORM_NAME } from '../../../../../components/Settings/Form';
import { actionCreators } from '../../../modules';
import { actionCreators as templateActionCreators } from '../../../modules/templates';
import { actionCreators as gamesActionCreators } from '../../../modules/games';
import { actionCreators as campaignsActionCreators } from '../../../modules/campaigns';
import { actionCreators as paymentsActionCreators } from '../../../modules/payments';

const mapStateToProps = ({
  bonusCampaignCreate: {
    create: { data, nodeGroups },
    games: { games, providers },
    templates: { data: templates },
    payments: { list: paymentMethods },
  },
  options: { data: { currencyCodes } },
  i18n: { locale },
}) => ({
  bonusCampaign: data,
  nodeGroups,
  currencies: currencyCodes,
  games,
  providers,
  templates,
  locale,
  paymentMethods,
});

const mapActions = {
  createCampaign: actionCreators.createCampaign,
  revert: actionCreators.revert,
  removeNode: actionCreators.removeNode,
  addNode: actionCreators.addNode,
  createFreeSpinTemplate: templateActionCreators.createFreeSpinTemplate,
  fetchFreeSpinTemplates: templateActionCreators.fetchFreeSpinTemplates,
  fetchFreeSpinTemplate: templateActionCreators.fetchFreeSpinTemplate,
  fetchGames: gamesActionCreators.fetchGames,
  fetchCampaigns: campaignsActionCreators.fetchCampaigns,
  fetchCampaign: campaignsActionCreators.fetchCampaign,
  fetchPaymentMethods: paymentsActionCreators.fetchPaymentMethods,
  change: (field, value) => change(FORM_NAME, field, value),
};

export default connect(mapStateToProps, mapActions)(Settings);
