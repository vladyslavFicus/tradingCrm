import React, { PropTypes } from 'react';

const Container = ({ children, target, onMouseOver }) => (
  <div
    className="mini-profile-show-button"
    id={`id-${target}`}
    onMouseOver={onMouseOver}
  >
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  target: PropTypes.string.isRequired,
  onMouseOver: PropTypes.func.isRequired,
};

export default Container;
