import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAvailableLanguages } from '../../config';
import { withModals } from '../../components/HighOrder';
import MultiCurrencyModal from '../../components/ReduxForm/MultiCurrencyModal';
import { actionCreators as authActionCreators } from '../../redux/modules/auth';
import { actionCreators as languageActionCreators } from '../../redux/modules/language';
import { actionCreators as noteActionCreators } from '../../redux/modules/note';
import { actionCreators as userPanelsActionCreators } from '../../redux/modules/user-panels';
import { actionCreators as appActionCreators } from '../../redux/modules/app';
import MainLayout from './MainLayout';

const mapStateToProps = (state) => {
  const {
    userPanels,
    auth,
    app,
    permissions: { data: permissions },
    i18n: { locale },
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
    user: auth,
    permissions,
    userPanels: userPanels.items,
    userPanelsByManager,
    activeUserPanel: activeUserPanel || null,
    activePanelIndex: userPanels.activeIndex,
    locale,
    languages: getAvailableLanguages(),
  };
};

const mapActionCreators = {
  changeDepartment: authActionCreators.changeDepartment,
  addPanel: userPanelsActionCreators.add,
  removePanel: userPanelsActionCreators.remove,
  resetPanels: userPanelsActionCreators.reset,
  setActivePanel: userPanelsActionCreators.setActive,
  replace: userPanelsActionCreators.replace,
  addNote: noteActionCreators.addNote,
  editNote: noteActionCreators.editNote,
  deleteNote: noteActionCreators.deleteNote,
  onLocaleChange: languageActionCreators.setLocale,
  toggleMenuTab: appActionCreators.toggleMenuTab,
  menuItemClick: appActionCreators.menuItemClick,
  initSidebar: appActionCreators.initSidebar,
  updateOperatorProfile: authActionCreators.updateProfile,
};

export default compose(
  connect(mapStateToProps, mapActionCreators),
  withModals({ multiCurrencyModal: MultiCurrencyModal }),
  withRouter,
)(MainLayout);
