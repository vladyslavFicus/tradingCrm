import React from 'react';
import Sticky from 'react-stickynode';
import TabHeaderNav from '../../../../../../components/TabHeaderNav';
import PropTypes from '../../../../../../constants/propTypes';

const StickyNavigation = ({ links, children }) => (
  <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
    <div className="row no-gutters tab-header">
      <TabHeaderNav links={links} />
      <div className="col-auto">
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
