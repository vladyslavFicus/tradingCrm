import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Badge from 'components/Badge';
import { getPlatformTypeLabel } from 'utils/tradingAccount';

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
        text={getPlatformTypeLabel(platformType)}
        backgroundColor={
          platformType === 'MT5' ? 'var(--state-colors-success)' : 'var(--state-colors-warning)'
        }
        color="var(--text-primary)"
        {...props}
      >
        {children}
      </Badge>
    );
  }
}

export default PlatformTypeBadge;
