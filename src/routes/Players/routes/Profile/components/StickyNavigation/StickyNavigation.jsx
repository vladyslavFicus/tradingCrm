import React from 'react';
import TabHeaderNav from '../../../../../../components/TabHeaderNav';
import PropTypes from '../../../../../../constants/propTypes';
import StickyWrapper from '../../../../../../components/StickyWrapper';

const StickyNavigation = ({ links, children }) => (
  <StickyWrapper top=".heading-fixed">
    <div className="row no-gutters tab-header">
      <TabHeaderNav links={links} />
      <div className="col-auto">
        {children}
      </div>
    </div>
  </StickyWrapper>
);

StickyNavigation.propTypes = {
  children: PropTypes.node,
  links: PropTypes.arrayOf(PropTypes.subTabRouteEntity).isRequired,
};

StickyNavigation.defaultProps = {
  children: null,
};

export default StickyNavigation;
