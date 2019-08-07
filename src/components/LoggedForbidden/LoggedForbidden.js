import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

class LoggedForbidden extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { logout } = this.props;

    return (
      <section className="page-content">
        <div className="page-content-inner">

          <div className="single-page-block">
            <div className="margin-auto text-center max-width-500">
              <h1>{I18n.t('LOGGED_FORBIDDEN.TITLE')}</h1>

              <p className="color-black">{I18n.t('LOGGED_FORBIDDEN.DESCRIPTION')}</p>
              <p>
                <button type="button" className="btn btn-default" onClick={logout}>
                  {I18n.t('LOGGED_FORBIDDEN.LOGOUT_BUTTON')}
                </button>
              </p>
            </div>
          </div>

        </div>
      </section>
    );
  }
}

export default LoggedForbidden;
