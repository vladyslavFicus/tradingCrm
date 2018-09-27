import React from 'react';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from '../../../../../../constants/propTypes';
import Placeholder from '../../../../../../components/Placeholder';

const HeaderLeadPlaceholder = ({ children, ...rest }) => (
  <Placeholder
    {...rest}
    className={null}
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
  </Placeholder>
);

HeaderLeadPlaceholder.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.any.isRequired,
};

HeaderLeadPlaceholder.defaultProps = {
  ready: false,
};

export default HeaderLeadPlaceholder;
