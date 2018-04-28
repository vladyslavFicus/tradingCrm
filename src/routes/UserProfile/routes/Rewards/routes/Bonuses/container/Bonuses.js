import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { actionCreators } from '../modules';
import { actionCreators as profileActionCreators } from '../../../../../modules/profile';
import List from '../components/View';
import { withModals } from '../../../../../../../components/HighOrder';
import CreateManualBonusModal from '../components/CreateModal';

const mapStateToProps = ({
  profile: { profile },
  userBonusesList: {
    list,
    bonus,
    templates: { data: templates },
  },
  i18n: { locale },
  userRewardsSubTabs: { tabs: subTabRoutes },
}) => ({
  list,
  playerProfile: profile,
  bonus,
  templates,
  locale,
  subTabRoutes,
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
  addBonusTemplate: actionCreators.addBonusTemplate,
};

export default compose(
  withModals({ createManualBonus: CreateManualBonusModal }),
  connect(mapStateToProps, mapActions),
)(List);
