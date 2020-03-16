import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Badge from 'components/Badge';

class PlatformTypeBadge extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    platformType: PropTypes.string.isRequired,
  };

  render() {
    const {
      children,
      platformType,
      ...props
    } = this.props;

    return (
      <Badge
        text={platformType}
        backgroundColor={platformType === 'MT5' ? '#8bc34a' : '#f3c331'}
        color="#000"
        {...props}
      >
        {children}
      </Badge>
    );
  }
}

export default PlatformTypeBadge;
