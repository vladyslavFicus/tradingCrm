import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sticky from 'react-stickynode';

const TabHeader = ({ title, children }) => (
  <Sticky top=".profile-heading" bottomBoundary={0} innerZ="2">
    <div className={classNames('tab-header', { 'row no-gutters': children })}>
      <div className={classNames('tab-header__title', { col: children })}>
        {title}
      </div>
      <If condition={children}>
        <div className="col-auto">
          {children}
        </div>
      </If>
    </div>
  </Sticky>
);

TabHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  children: PropTypes.node,
};
TabHeader.defaultProps = {
  children: null,
};

export default TabHeader;
