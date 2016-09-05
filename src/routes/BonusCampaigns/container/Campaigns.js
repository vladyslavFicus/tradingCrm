import { connect } from 'react-redux';
import List from '../components/List';
import { actionCreators as campaignsListActionCreators } from '../modules/list';

const mapStateToProps = (state) => ({
  campaigns: {
    ...state.bonusCampaignsList,
  },
});
const mapActions = {
  ...campaignsListActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
