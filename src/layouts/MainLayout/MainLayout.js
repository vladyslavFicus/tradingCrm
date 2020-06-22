import React, { PureComponent, Suspense } from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import config, { getBrandId } from 'config';
import PropTypes from 'constants/propTypes';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import BackToTop from 'components/BackToTop';
import ShortLoader from 'components/ShortLoader';
import { withStorage } from 'providers/StorageProvider';
import PermissionProvider from 'providers/PermissionsProvider';
import './MainLayout.scss';


class MainLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    auth: PropTypes.auth.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    // Redirect to logout if brand wasn't defined
    if (!getBrandId()) {
      this.props.history.replace('/logout');
    }
  }

  render() {
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
      </PermissionProvider>
    );
  }
}

export default compose(
  withRouter,
  withStorage(['auth']),
)(MainLayout);
