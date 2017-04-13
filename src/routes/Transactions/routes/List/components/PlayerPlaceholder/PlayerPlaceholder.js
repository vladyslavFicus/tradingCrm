import React, { Component, PropTypes } from 'react';
import { TextRow } from 'react-placeholder/lib/placeholders';
import Placeholder from '../../../../../../components/Placeholder';

class PlayerPlaceholder extends Component {
  static propTypes = {
    ready: PropTypes.bool,
    children: PropTypes.any.isRequired,
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <Placeholder
        {...rest}
        className={null}
        customPlaceholder={(
          <div className="player-placeholder">
            <TextRow className="animated-background" style={{ width: '170px', height: '11px' }} />
            <TextRow className="animated-background" style={{ width: '135px', height: '9px' }} />
            <TextRow className="animated-background" style={{ width: '50px', height: '9px' }} />
          </div>
        )}
      >
        {children}
      </Placeholder>
    );
  }
}

export default PlayerPlaceholder;
