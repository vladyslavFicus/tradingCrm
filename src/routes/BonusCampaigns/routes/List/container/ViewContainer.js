import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';
import { statuses } from '../../../constants';

const mapStateToProps = ({ bonusCampaigns, i18n: { locale } }) => ({
  ...bonusCampaigns,
  locale,
  statuses: Object.keys(statuses),
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  onChangeCampaignStatus: actionCreators.changeCampaignState,
  fetchTypes: actionCreators.fetchTypes,
  resetAll: actionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(View);
