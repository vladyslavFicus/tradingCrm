import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as profileActionCreators } from '../../../../../modules/profile';
import List from '../components/View';
import { routes as subTabRoutes } from '../../../constants';
import { filterItems as filterAvailableItems } from '../../../../../../../utils/permissions';

const mapStateToProps = ({
  profile: { profile },
  userBonusesList: {
    list,
    bonus,
    templates: { data: templates },
  },
  i18n: { locale },
  permissions: { data: currentPermissions },
}) => ({
  list,
  playerProfile: profile,
  bonus,
  templates,
  locale,
  subTabRoutes: filterAvailableItems(subTabRoutes, currentPermissions),
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createBonusTemplate: actionCreators.createBonusTemplate,
  fetchBonusTemplates: actionCreators.fetchBonusTemplates,
  fetchBonusTemplate: actionCreators.fetchBonusTemplate,
  assignBonusTemplate: actionCreators.assignBonusTemplate,
  acceptBonus: actionCreators.acceptBonus,
  cancelBonus: actionCreators.cancelBonus,
  permitBonusConversion: actionCreators.permitBonusConversion,
  fetchActiveBonus: actionCreators.fetchActiveBonus,
  fetchProfile: profileActionCreators.fetchProfile,
};

export default connect(mapStateToProps, mapActions)(List);
