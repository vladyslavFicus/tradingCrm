import React, { PureComponent } from 'react';
import Validator from 'validatorjs';
import moment from 'moment';
import { withApollo, compose } from 'react-apollo';
import I18n from 'i18n';
import IndexRoute from 'routes/IndexRoute';
import { setBrand } from 'config';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';

class Root extends PureComponent {
  static propTypes = {
    auth: PropTypes.auth,
    locale: PropTypes.string,
    client: PropTypes.shape({
      resetStore: PropTypes.func.isRequired,
    }).isRequired,
    brand: PropTypes.shape({
      id: PropTypes.string,
    }),
  };

  static defaultProps = {
    locale: null,
    auth: null,
    brand: null,
  };

  state = {
    // Here is required state, because we need to do re-render if new brand chosen
    // But we shouldn't do a component re-mount (so we doesn't pass this brand as key to IndexRoute).
    brand: this.props.brand?.id,
  };

  constructor(props) {
    super(props);

    // Set brand to configuration on application startup
    setBrand(props.brand?.id);
  }

  static getDerivedStateFromProps(props, state) {
    // If new brand chosen -> do reset apollo store to prevent data caching from previous brand
    // set new brand to configuration and update brand in state for re-render tree of components to fetch new data
    if (props.brand?.id !== state.brand) {
      props.client.resetStore();

      setBrand(props.brand?.id);

      return {
        brand: props.brand?.id,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    // Force reload page in hidden tabs when brand was changed in another tab
    if (document.hidden && prevProps.brand?.id !== this.props.brand?.id) {
      window.location.reload(true);
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

    return (
      <IndexRoute key={`${I18n.locale}-${auth?.department}`} />
    );
  }
}

export default compose(
  withApollo,
  withStorage(['locale', 'auth', 'brand']),
)(Root);
