import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import config from '../../../../../config';
import List from '../components/List';

const mapStateToProps = ({ operatorsList: list, ...state, i18n: { locale } }) => ({
  list,
  locale,
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
  availableDepartments: config.availableDepartments,
  availableRoles: config.availableRoles,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  onSubmitNewOperator: actionCreators.createOperator,
  fetchOperatorMiniProfile: miniProfileActionCreators.fetchOperatorProfile,
};

export default connect(mapStateToProps, mapActions)(List);
