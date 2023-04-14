import React, { PureComponent } from 'react';
import { withApollo } from '@apollo/client/react/hoc';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { getVersion, setBrand } from 'config';
import IndexRoute from 'routes/IndexRoute';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import UpdateVersionModal from 'modals/UpdateVersionModal';

class App extends PureComponent {
  static propTypes = {
    auth: PropTypes.auth,
    client: PropTypes.shape({
      resetStore: PropTypes.func.isRequired,
    }).isRequired,
    brand: PropTypes.shape({
      id: PropTypes.string,
    }),
    modals: PropTypes.shape({
      updateVersionModal: PropTypes.modalType,
    }).isRequired,
    clientVersion: PropTypes.string,
    ...withStorage.propTypes,
  };

  static defaultProps = {
    auth: null,
    brand: null,
    clientVersion: '',
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

  checkClientVersion() {
    const { storage, clientVersion, modals: { updateVersionModal } } = this.props;

    const version = getVersion();

    if (!clientVersion) {
      storage.set(version);
    }

    if (clientVersion && clientVersion !== version) {
      updateVersionModal.show({
        newVersion: version,
      });
    }
  }

  componentDidMount() {
    this.checkClientVersion();
  }

  componentDidUpdate(prevProps) {
    // Force reload page in hidden tabs when brand was changed in another tab
    if (document.hidden && prevProps.brand?.id !== this.props.brand?.id) {
      window.location.reload(true);
    }
  }

  render() {
    const { auth } = this.props;

    return (
      <IndexRoute key={auth?.department} />
    );
  }
}

export default compose(
  withApollo,
  withStorage(['auth', 'brand', 'clientVersion']),
  withModals({ updateVersionModal: UpdateVersionModal }),
)(App);
