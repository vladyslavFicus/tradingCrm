import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import config from '../../../../../config';
import List from '../components/List';

const mapStateToProps = ({ operatorsList: list, ...state, i18n: { locale } }) => ({
  list,
  locale,
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
  departments: config.availableDepartments,
  roles: config.availableRoles,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  onSubmitNewOperator: actionCreators.createOperator,
};

export default connect(mapStateToProps, mapActions)(List);
