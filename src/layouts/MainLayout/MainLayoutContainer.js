import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import { getAvailableLanguages } from '../../config';
import { withModals } from '../../components/HighOrder';
import MultiCurrencyModal from '../../components/ReduxForm/MultiCurrencyModal';
import { actionCreators as noteActionCreators } from '../../redux/modules/note';
import { actionCreators as appActionCreators } from '../../redux/modules/app';
import MainLayout from './MainLayout';

const mapStateToProps = (state) => {
  const {
    app,
  } = state;

  return {
    app,
    languages: getAvailableLanguages(),
  };
};

const mapActionCreators = {
  addNote: noteActionCreators.addNote,
  editNote: noteActionCreators.editNote,
  deleteNote: noteActionCreators.deleteNote,
  toggleMenuTab: appActionCreators.toggleMenuTab,
  menuItemClick: appActionCreators.menuItemClick,
  initSidebar: appActionCreators.initSidebar,
};

export default compose(
  withRouter,
  withStorage(['auth']),
  connect(mapStateToProps, mapActionCreators),
  withModals({ multiCurrencyModal: MultiCurrencyModal }),
)(MainLayout);
