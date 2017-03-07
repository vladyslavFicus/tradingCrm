import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import List from '../components/List';
import { getAvailableTags } from 'config/index';

const mapStateToProps = ({ usersList: list, auth, ...state }) => ({
  list,
  availableTags: getAvailableTags(auth.department),
  filterValues: getFormValues('userListGridFilter')(state) || {},
});

const mapActions = {
  ...actionCreators,
  fetchESEntities: actionCreators.fetchESEntities,
};

export default connect(mapStateToProps, mapActions)(List);
