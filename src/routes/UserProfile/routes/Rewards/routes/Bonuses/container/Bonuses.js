import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as profileActionCreators } from '../../../../../modules/profile';
import List from '../components/View';

const mapStateToProps = (state) => {
  const {
    profile: { profile },
    userBonusesList: {
      list,
      bonus,
      templates: { data: templates },
    },
    i18n: { locale },
  } = state;

  return ({
    list,
    playerProfile: profile,
    bonus,
    templates,
    locale,
  });
};
const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createBonusTemplate: actionCreators.createBonusTemplate,
  fetchBonusTemplates: actionCreators.fetchBonusTemplates,
  fetchBonusTemplate: actionCreators.fetchBonusTemplate,
  assignBonusTemplate: actionCreators.assignBonusTemplate,
  acceptBonus: actionCreators.acceptBonus,
  cancelBonus: actionCreators.cancelBonus,
  permitConversionBonus: actionCreators.permitConversionBonus,
  fetchActiveBonus: actionCreators.fetchActiveBonus,
  fetchProfile: profileActionCreators.fetchProfile,
};

export default connect(mapStateToProps, mapActions)(List);
