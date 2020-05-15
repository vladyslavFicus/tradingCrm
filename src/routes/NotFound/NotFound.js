import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import './NotFound.scss';

class NotFound extends PureComponent {
  static propTypes = {
    token: PropTypes.string.isRequired,
  }

  render() {
    const { token } = this.props;

    if (!token) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <div className="NotFound">
        <h1 className="NotFound__title">{I18n.t('NOT_FOUND.TITLE')}</h1>
        <p className="NotFound__subtitle">{I18n.t('NOT_FOUND.DESCRIPTION')}</p>
      </div>
    );
  }
}

export default withStorage(['token'])(NotFound);
