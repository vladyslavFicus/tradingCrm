import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { statuses } from '../../../constants';
import config from '../../../../../config';

const mapStateToProps = ({ bonusCampaigns, i18n: { locale } }) => ({
  ...bonusCampaigns,
  locale,
  statuses: Object.keys(statuses),
  currencies: config.nas.currencies.supported || [],
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createCampaign: actionCreators.createCampaign,
  exportEntities: actionCreators.exportEntities,
  onChangeCampaignStatus: actionCreators.changeCampaignState,
  fetchTypes: actionCreators.fetchTypes,
  resetAll: actionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(View);
