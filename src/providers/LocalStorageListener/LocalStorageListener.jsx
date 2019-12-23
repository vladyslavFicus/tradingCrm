import React, { Component } from 'react';
import Validator from 'validatorjs';
import moment from 'moment';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from '../../constants/propTypes';
import IndexRoute from '../../routes/IndexRoute';
import I18n from '../../i18n';

class LocalStorageListener extends Component {
  static propTypes = {
    auth: PropTypes.auth,
    locale: PropTypes.string,
    storage: PropTypes.storage.isRequired,
    brand: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    locale: null,
    auth: null,
  }

  /**
   * Set locale from storage or if it's undefined -> from brand config
   */
  initLocale() {
    const { storage } = this.props;
    const locale = this.props.locale || 'en';

    if (Object.keys(I18n.translations).includes(locale)) {
      I18n.locale = locale;
    }

    storage.set({ locale });
    moment.locale(I18n.locale === 'zh' ? 'zh-cn' : I18n.locale);
    Validator.useLang(I18n.locale);
  }

  render() {
    const { auth, locale, brand } = this.props;
    this.initLocale();

    return (
      <IndexRoute key={`${locale}-${auth ? auth.department : ''}-${brand ? brand.id : ''}`} />
    );
  }
}

export default withStorage(['locale', 'auth', 'brand'])(LocalStorageListener);
