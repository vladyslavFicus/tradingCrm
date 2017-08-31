import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/View';

const mapStateToProps = ({
  userBonusCampaignsList: { list },
  i18n: { locale },
}) => ({
  list,
  locale,
});
const mapActions = {
  fetchAvailableCampaignList: actionCreators.fetchAvailableCampaignList,
  declineCampaign: actionCreators.declineCampaign,
};

export default connect(mapStateToProps, mapActions)(List);
