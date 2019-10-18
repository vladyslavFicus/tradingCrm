import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TabHeader = ({ title, children }) => (
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
