import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import { getAvailableLanguages } from '../../config';
import { withModals } from '../../components/HighOrder';
import MultiCurrencyModal from '../../components/ReduxForm/MultiCurrencyModal';
import { actionCreators as noteActionCreators } from '../../redux/modules/note';
import { actionCreators as userPanelsActionCreators } from '../../redux/modules/user-panels';
import { actionCreators as appActionCreators } from '../../redux/modules/app';
import MainLayout from './MainLayout';

const mapStateToProps = (state) => {
  const {
    userPanels,
    auth,
    app,
    settings,
  } = state;
  const userPanelsByManager = userPanels.items.filter(userTab => (
    userTab.auth
    && userTab.auth.brandId === auth.brandId
    && userTab.auth.uuid === auth.uuid
  ));

  const activeUserPanel = userPanels.items.find(p => p.uuid === userPanels.activeIndex);

  return {
    app,
    settings,
    userPanels: userPanels.items,
    userPanelsByManager,
    activeUserPanel: activeUserPanel || null,
    activePanelIndex: userPanels.activeIndex,
    languages: getAvailableLanguages(),
  };
};

const mapActionCreators = {
  addPanel: userPanelsActionCreators.add,
  removePanel: userPanelsActionCreators.remove,
  resetPanels: userPanelsActionCreators.reset,
  setActivePanel: userPanelsActionCreators.setActive,
  replace: userPanelsActionCreators.replace,
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
