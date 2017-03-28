import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({ userLimits: { view } }) => ({
  ...view,
});

const mapActions = {
  cancelLimit: actionCreators.cancelLimit,
  fetchEntities: actionCreators.fetchLimits,
  setLimit: actionCreators.setLimit,
  fetchNotes: actionCreators.fetchNotes,
  addNote: actionCreators.addNote,
  editNote: actionCreators.editNote,
  deleteNote: actionCreators.deleteNote,
};

export default connect(mapStateToProps, mapActions)(View);
