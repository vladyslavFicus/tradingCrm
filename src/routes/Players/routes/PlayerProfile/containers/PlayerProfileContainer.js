import { connect } from 'react-redux';
import { actionCreators as usersPanelsActionCreators } from '../../../../../redux/modules/user-panels';
import PlayerProfile from '../components/PlayerProfile';

const mapActionCreators = {
  addUserPanel: usersPanelsActionCreators.add,
};

export default connect(
  ({ settings, auth: { brandId, uuid } }) => ({ settings, brandId, uuid }),
  mapActionCreators
)(PlayerProfile);
