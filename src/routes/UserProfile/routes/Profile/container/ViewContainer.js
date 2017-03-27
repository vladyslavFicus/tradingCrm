import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as profileActionCreators } from '../../../modules';
import { actionCreators as kycActionCreators } from '../modules/kyc';

const mapStateToProps = ({ profile: { view: profile } }) => ({
  ...profile,
});
const mapActions = {
  fetchProfile: profileActionCreators.fetchProfile,
  verifyIdentity: kycActionCreators.verifyIdentity,
  refuseIdentity: kycActionCreators.refuseIdentity,
};

export default connect(mapStateToProps, mapActions)(View);
