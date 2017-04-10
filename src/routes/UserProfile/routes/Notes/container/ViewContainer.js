import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({ userNotes: { view, noteTypes } }) => ({
  view,
  noteTypes,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
};

export default connect(mapStateToProps, mapActions)(View);
