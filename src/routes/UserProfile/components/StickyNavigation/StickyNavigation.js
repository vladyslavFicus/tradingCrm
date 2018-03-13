import React from 'react';
import Sticky from 'react-stickynode';
import SubTabNavigation from '../../../../components/SubTabNavigation';
import PropTypes from '../../../../constants/propTypes';

const StickyNavigation = ({ links, children }) => (
  <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
    <div className="tab-header">
      <SubTabNavigation links={links} />
      <div className="tab-header__actions">
        {children}
      </div>
    </div>
  </Sticky>
);

StickyNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  links: PropTypes.arrayOf(PropTypes.subTabRouteEntity).isRequired,
};

export default StickyNavigation;
