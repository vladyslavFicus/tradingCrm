import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import { withModals } from '../../components/HighOrder';
import MultiCurrencyModal from '../../components/ReduxForm/MultiCurrencyModal';
import { actionCreators as noteActionCreators } from '../../redux/modules/note';
import MainLayout from './MainLayout';

const mapActionCreators = {
  addNote: noteActionCreators.addNote,
  editNote: noteActionCreators.editNote,
  deleteNote: noteActionCreators.deleteNote,
};

export default compose(
  withRouter,
  withStorage(['auth']),
  connect(null, mapActionCreators),
  withModals({ multiCurrencyModal: MultiCurrencyModal }),
)(MainLayout);
