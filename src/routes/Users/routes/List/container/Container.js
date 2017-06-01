import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({ usersList: list, ...state }) => ({
  list,
  filterValues: getFormValues('userListGridFilter')(state) || {},
});

const mapActions = {
  fetchESEntities: actionCreators.fetchESEntities,
  exportEntities: actionCreators.exportEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
