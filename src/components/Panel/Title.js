import React from 'react';
import PropTypes from 'prop-types';
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
