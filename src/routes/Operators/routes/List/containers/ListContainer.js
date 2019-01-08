import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';
import { graphql } from 'react-apollo';
import { actionCreators as authoritiesActionCreators } from '../../../../../redux/modules/auth/authorities';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { createHierarchyUser } from '../../../../../graphql/mutations/hierarchy';
import { withModals, withNotifications } from '../../../../../components/HighOrder';
import CreateOperatorModalContainer from '../components/CreateOperatorModal';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({
  operatorsList: list,
  i18n: { locale },
  auth: { uuid },
  ...state
}) => ({
  list,
  locale,
  operatorId: uuid,
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
  withModals({ createOperator: CreateOperatorModalContainer }),
  withNotifications,
  graphql(createHierarchyUser, {
    name: 'createHierarchyUser',
  })
)(List);
