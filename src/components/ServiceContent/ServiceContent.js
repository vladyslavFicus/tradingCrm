import { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

class ServiceContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    optionServices: PropTypes.shape({
      options: PropTypes.shape({
        services: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
    service: PropTypes.string.isRequired,
  };
  static defaultProps = {
    optionServices: {},
  };

  render() {
    const {
      children,
      optionServices,
      service,
    } = this.props;

    return get(optionServices, 'options.services', []).includes(service) ? children : null;
  }
}

export default ServiceContent;
