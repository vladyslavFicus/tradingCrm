import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TabsItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
  }

  render() {
    const {
      component: Component,
      ...props
    } = this.props;

    return <Component {...props} />;
  }
}

export default TabsItem;
