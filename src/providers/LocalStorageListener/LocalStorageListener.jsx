import React, { Component } from 'react';
import Validator from 'validatorjs';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { getBrandId, setBrandId, removeActiveBrand } from 'config';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from '../../constants/propTypes';
import IndexRoute from '../../routes/IndexRoute';
import I18n from '../../i18n';

class LocalStorageListener extends Component {
  static propTypes = {
    auth: PropTypes.auth,
    locale: PropTypes.string,
    token: PropTypes.string,
  };

  static defaultProps = {
    locale: null,
    auth: null,
    token: null,
  };

  /**
   * Init active brand depends on token from storage
   */
  initBrand() {
    try {
      const { brandId } = jwtDecode(this.props.token);

      setBrandId(brandId);
    } catch (e) {
      removeActiveBrand();
    }
  }

  /**
   * Set locale from storage or if it's undefined -> from brand config
   */
  initLocale() {
    const locale = this.props.locale || 'en';

    if (Object.keys(I18n.translations).includes(locale)) {
      I18n.locale = locale;
    }

    moment.locale(I18n.locale === 'zh' ? 'zh-cn' : I18n.locale);
    Validator.useLang(I18n.locale);
  }

  render() {
    const { auth } = this.props;
    this.initLocale();
    this.initBrand();

    return (
      <IndexRoute key={`${I18n.locale}-${auth ? auth.department : ''}-${getBrandId()}`} />
    );
  }
}

export default withStorage(['locale', 'auth', 'token'])(LocalStorageListener);
