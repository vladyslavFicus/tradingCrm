import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';
import { getAvailableTags } from 'config/index';

const mapStateToProps = ({ usersList: list, auth }) => ({
  list,
  availableTags: getAvailableTags(auth.department),
});

const mapActions = {
  ...actionCreators,
  fetchESEntities: actionCreators.fetchESEntities,
};

export default connect(mapStateToProps, mapActions)(List);
