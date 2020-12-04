import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class StaticTabsItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.element.isRequired,
  }

  render() {
    return <>{this.props.children}</>;
  }
}

export default StaticTabsItem;
