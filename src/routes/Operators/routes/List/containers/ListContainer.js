import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import { actionCreators as authoritiesActionCreators } from '../../../../../redux/modules/auth/authorities';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import List from '../components/List';
import { withModals, withNotifications } from '../../../../../components/HighOrder';
import CreateOperatorModal from '../../../components/CreateOperatorModal';

const mapStateToProps = ({ operatorsList: list, i18n: { locale }, ...state }) => ({
  list,
  locale,
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  onSubmitNewOperator: actionCreators.createOperator,
  fetchOperatorMiniProfile: miniProfileActionCreators.fetchOperatorProfile,
  addAuthority: authoritiesActionCreators.addAuthority,
  fetchAuthorities: authoritiesActionCreators.fetchAuthorities,
  fetchAuthoritiesOptions: authoritiesActionCreators.fetchAuthoritiesOptions,
};

export default compose(
  connect(mapStateToProps, mapActions),
  withModals({ createOperator: CreateOperatorModal }),
  withNotifications
)(List);
