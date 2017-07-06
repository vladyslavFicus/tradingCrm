import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/View';

const mapStateToProps = ({
  userBonusCampaignsList: { list },
}) => ({
  list,
});
const mapActions = {
  fetchAvailableCampaignList: actionCreators.fetchAvailableCampaignList,
};

export default connect(mapStateToProps, mapActions)(List);
