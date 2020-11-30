import React, { PureComponent } from 'react';
import config from 'config';
import PropTypes from 'prop-types';
import { withRequests } from 'apollo';
import Preloader from 'components/Preloader';
import ConfigQuery from './graphql/ConfigQuery';

class ConfigProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    config: PropTypes.object.isRequired,
  };

  render() {
    const {
      config: {
        loading,
        data,
      },
    } = this.props;

    if (loading && !data?.config) {
      return <Preloader isVisible />;
    }

    config.brand = { ...config.brand, ...data?.config };

    return this.props.children;
  }
}

export default withRequests({
  config: ConfigQuery,
})(ConfigProvider);
