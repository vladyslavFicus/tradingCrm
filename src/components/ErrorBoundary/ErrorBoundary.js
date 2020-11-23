import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import { getBrand } from 'config';
import './ErrorBoundary.scss';

class ErrorBoundary extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    children: PropTypes.element.isRequired,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  static getDerivedStateFromProps({ location: { pathname } }, state) {
    if (pathname !== state.pathname) {
      return {
        hasError: false,
        error: null,
        pathname,
      };
    }
    return null;
  }

  componentDidCatch(error) {
    this.setState({ error: error.stack });
  }

  state = {
    hasError: false,
    pathname: null,
    error: null,
  };

  render() {
    const { hasError, error } = this.state;

    const isAvailableToShowMessage = error && ['dev01', 'dev02', 'qa01'].includes(getBrand()?.env);

    return (
      <Choose>
        <When condition={hasError}>
          <div className="ErrorBoundary">
            <div className="ErrorBoundary__container">
              <h1 className="ErrorBoundary__title">{I18n.t('COMMON.ERROR_TITLE')}</h1>
              <p className="ErrorBoundary__description">{I18n.t('COMMON.ERROR_CONTENT')}</p>

              <If condition={isAvailableToShowMessage}>
                <div className="ErrorBoundary__error" dangerouslySetInnerHTML={{ __html: error }} />
              </If>
            </div>
          </div>
        </When>
        <Otherwise>
          {this.props.children}
        </Otherwise>
      </Choose>
    );
  }
}

export default withRouter(ErrorBoundary);
