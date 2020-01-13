import React, { PureComponent, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import config, { getBrandId } from 'config';
import PropTypes from 'constants/propTypes';
import NotePopover from 'components/NotePopover';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import ShortLoader from 'components/ShortLoader';
import { withModals } from 'components/HighOrder';
import MultiCurrencyModal from 'components/ReduxForm/MultiCurrencyModal';
import { withStorage } from 'providers/StorageProvider';
import PermissionProvider from 'providers/PermissionsProvider';
import './MainLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class MainLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    auth: PropTypes.auth.isRequired,
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.object.isRequired,
    }).isRequired,
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    notes: PropTypes.shape({
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
      setNoteChangedCallback: PropTypes.func.isRequired,
      hidePopover: PropTypes.func.isRequired,
    }),
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  mounted = false;

  constructor(props, context) {
    super(props, context);

    const { history: { location } } = props;

    this.state = {
      location,
      popover: { ...popoverInitialState },
    };
  }

  getChildContext() {
    const {
      modals,
    } = this.props;

    return {
      modals,
      notes: {
        hidePopover: this.handlePopoverHide,
        onAddNoteClick: this.handleAddNoteClick,
        onEditNoteClick: this.handleEditNoteClick,
        setNoteChangedCallback: this.setNoteChangedCallback,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.history.location !== prevState.location) {
      return {
        location: nextProps.history.location,
        noteChangedCallback: null,
        popover: { ...popoverInitialState },
      };
    }

    return null;
  }

  componentDidMount() {
    this.mounted = true;

    // Redirect to logout if brand wasn't defined
    if (!getBrandId()) {
      this.props.history.replace('/logout');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setNoteChangedCallback = (callback) => {
    this.updateState({ noteChangedCallback: callback });
  };

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  handleAddNoteClick = (target, targetUUID, playerUUID, targetType, params = {}) => {
    this.updateState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          target,
          targetType,
          initialValues: {
            targetUUID,
            playerUUID,
            pinned: false,
          },
        },
      },
    });
  };

  handleEditNoteClick = (target, item, params = {}) => {
    this.updateState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          item,
          target,
          initialValues: { ...item },
        },
      },
    });
  };

  handlePopoverHide = () => {
    this.updateState({ popover: { ...popoverInitialState } });
  };

  render() {
    const { popover } = this.state;
    const {
      children,
      auth,
    } = this.props;

    const isShowProductionAlert = auth.department === 'ADMINISTRATION' && config.environment.includes('prod');

    return (
      <PermissionProvider key={auth.department}>
        <Header />

        <Sidebar />

        <main className="content-container">
          <Suspense fallback={<ShortLoader />}>
            {children}
          </Suspense>
        </main>

        <BackToTop />

        {/* Notify ADMINISTRATION role if it's production environment */}
        <If condition={isShowProductionAlert}>
          <div className="production-footer">
            <span role="img" aria-label="fire">==== 🔥 PRODUCTION 🔥 ====</span>
          </div>
        </If>

        <If condition={popover.name === NOTE_POPOVER}>
          <NotePopover
            isOpen
            toggle={this.handlePopoverHide}
            {...popover.params}
          />
        </If>
      </PermissionProvider>
    );
  }
}

export default compose(
  withRouter,
  withStorage(['auth']),
  withModals({ multiCurrencyModal: MultiCurrencyModal }),
)(MainLayout);
