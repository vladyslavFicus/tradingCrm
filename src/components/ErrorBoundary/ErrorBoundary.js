import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';

class ErrorBoundary extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    children: PropTypes.element.isRequired,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static getDerivedStateFromProps({ location: { pathname } }, state) {
    if (pathname !== state.pathname) {
      return {
        hasError: false,
        pathname,
      };
    }
    return null;
  }

  state = {
    hasError: false,
    pathname: null,
  };

  render() {
    if (this.state.hasError) {
      return <h1 dangerouslySetInnerHTML={{ __html: I18n.t('COMMON.ERROR_CONTENT') }} />;
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
