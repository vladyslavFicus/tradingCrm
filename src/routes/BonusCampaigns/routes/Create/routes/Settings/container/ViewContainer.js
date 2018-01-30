import { connect } from 'react-redux';
import { change } from 'redux-form';
import View from '../components/View';
import { FORM_NAME } from '../../../../../components/BonusCampaign/Settings/Form';
import { actionCreators } from '../../../modules';
import { actionCreators as settingsActionCreators } from '../modules';
import { actionCreators as campaignsActionCreators } from '../modules/campaigns';

const mapStateToProps = ({
  bonusCampaignCreate: { data, nodeGroups },
  bonusCampaignSettings: {
    games: { games, providers },
    templates: { data: templates },
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
});

const mapActions = {
  createCampaign: actionCreators.createCampaign,
  revert: actionCreators.revert,
  removeNode: actionCreators.removeNode,
  addNode: actionCreators.addNode,
  createFreeSpinTemplate: settingsActionCreators.createFreeSpinTemplate,
  fetchFreeSpinTemplates: settingsActionCreators.fetchFreeSpinTemplates,
  fetchFreeSpinTemplate: settingsActionCreators.fetchFreeSpinTemplate,
  fetchGames: settingsActionCreators.fetchGames,
  fetchCampaigns: campaignsActionCreators.fetchCampaigns,
  fetchCampaign: campaignsActionCreators.fetchCampaign,
  change: (field, value) => change(FORM_NAME, field, value),
};

export default connect(mapStateToProps, mapActions)(View);
