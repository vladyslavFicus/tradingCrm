import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as profileActionCreators } from '../../../../../modules/profile';
import List from '../components/View';
import config from '../../../../../../../config';

const mapStateToProps = (state) => {
  const {
    profile: { profile },
    userBonusesList: { list, bonus },
    i18n: { locale },
  } = state;

  return ({
    list,
    playerProfile: profile,
    bonus,
    locale,
    canClaimBonus: config.nas.brand.claim_bonus.enable,
  });
};
const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createBonus: actionCreators.createBonus,
  acceptBonus: actionCreators.acceptBonus,
  cancelBonus: actionCreators.cancelBonus,
  fetchActiveBonus: actionCreators.fetchActiveBonus,
  fetchProfile: profileActionCreators.fetchProfile,
};

export default connect(mapStateToProps, mapActions)(List);
