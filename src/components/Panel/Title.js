import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

const Title = ({ children }) => (
  <div className={classNames(['panel-heading'])}>
    {children}
  </div>
);

Title.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Title;
