import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Button } from '../Buttons';
import './ErrorBoundary.scss';

type Props = {
  children: React.ReactNode,
};

class ErrorBoundary extends PureComponent<Props> {
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error: error.stack,
    };
  }

  state = {
    hasError: false,
    error: '',
  };

  render() {
    const { hasError, error } = this.state;

    return (
      <Choose>
        <When condition={hasError}>
          <div className="ErrorBoundary">
            <div className="ErrorBoundary__container">
              <h1 className="ErrorBoundary__title">{I18n.t('COMMON.ERROR_TITLE')}</h1>
              <p className="ErrorBoundary__description">{I18n.t('COMMON.ERROR_CONTENT')}</p>

              <Button
                tertiary
                className="ErrorBoundary__button"
                onClick={() => window.location.reload()}
              >
                {I18n.t('COMMON.ERROR_RELOAD_PAGE')}
              </Button>

              <If condition={!!error}>
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

export default React.memo(ErrorBoundary);
