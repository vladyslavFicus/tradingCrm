import { connect } from 'react-redux';
import Rewards from '../components/Rewards';
import { actionCreators as subTabActionCreators } from '../../../modules/subtabs';

const mapStateToProps = ({
  userRewardsSubTabs,
  permissions: {
    data: currentPermissions,
  },
}) => ({
  userRewardsSubTabs,
  currentPermissions,
});

const mapActions = {
  initSubTabs: subTabActionCreators.initSubTabs,
};

export default connect(mapStateToProps, mapActions)(Rewards);

