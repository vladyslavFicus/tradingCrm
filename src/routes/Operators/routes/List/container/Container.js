import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({ operatorsList: list, ...state }) => ({
  list,
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
});

const mapActions = {
  ...actionCreators,
  fetchEntities: actionCreators.fetchEntities,
};

export default connect(mapStateToProps, mapActions)(List);
