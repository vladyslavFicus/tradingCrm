import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/list';

const mapStateToProps = ({ userDevices: { list } }) => ({
  list,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
};

export default connect(mapStateToProps, mapActions)(View);
