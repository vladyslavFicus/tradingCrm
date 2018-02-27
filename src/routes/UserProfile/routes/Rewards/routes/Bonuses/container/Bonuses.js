import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as profileActionCreators } from '../../../../../modules/profile';
import List from '../components/View';
import { routes as subTabRoutes } from '../../../constants';
import { filterItems as filterAvailableItems } from '../../../../../../../utils/permissions';

const mapStateToProps = ({
  profile: { profile },
  userBonusesList: { list, bonus },
  i18n: { locale },
  permissions: { data: currentPermissions },
}) => ({
  list,
  playerProfile: profile,
  bonus,
  locale,
  subTabRoutes: filterAvailableItems(subTabRoutes, currentPermissions),
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createBonus: actionCreators.createBonus,
  acceptBonus: actionCreators.acceptBonus,
  cancelBonus: actionCreators.cancelBonus,
  fetchActiveBonus: actionCreators.fetchActiveBonus,
  fetchProfile: profileActionCreators.fetchProfile,
};

export default connect(mapStateToProps, mapActions)(List);
