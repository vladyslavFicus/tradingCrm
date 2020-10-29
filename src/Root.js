import React, { PureComponent } from 'react';
import Validator from 'validatorjs';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import I18n from 'i18n';
import IndexRoute from 'routes/IndexRoute';
import { getBrand, setBrand, removeActiveBrand } from 'config';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';

class Root extends PureComponent {
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

      setBrand(brandId);
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
      <IndexRoute key={`${I18n.locale}-${auth?.department}-${getBrand()?.id}`} />
    );
  }
}

export default withStorage(['locale', 'auth', 'token'])(Root);
