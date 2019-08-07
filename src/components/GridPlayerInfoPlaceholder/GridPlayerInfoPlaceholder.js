import React from 'react';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from '../../constants/propTypes';
import Placeholder from '../Placeholder';

const GridPlayerInfoPlaceholder = ({ children, ...rest }) => (
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
GridPlayerInfoPlaceholder.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.any.isRequired,
};

GridPlayerInfoPlaceholder.defaultProps = {
  ready: false,
};

export default GridPlayerInfoPlaceholder;
