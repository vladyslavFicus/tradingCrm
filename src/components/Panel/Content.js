import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Content = ({ children }) => (
  <div className={classNames(['panel-body'])}>
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Content;
