import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';

const HeaderPlayerPlaceholder = ({ children, ...rest }) => (
  <ReactPlaceholder
    {...rest}
    customPlaceholder={(
      <div className="panel-heading-row__info">
        <div className="panel-heading-row__info-title">
          <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
        </div>
        <div className="panel-heading-row__info-ids">
          <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
        </div>
      </div>
    )}
  >
    {children}
  </ReactPlaceholder>
);
HeaderPlayerPlaceholder.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.any.isRequired,
};
HeaderPlayerPlaceholder.defaultProps = {
  ready: false,
};

export default HeaderPlayerPlaceholder;
