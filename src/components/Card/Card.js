import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Card = ({ children, noBorders }) => (
  <div className={classNames('card', {'no-borders': noBorders})}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  noBorders: PropTypes.bool,
};
Card.defaultProps = {
  noBorders: false,
};

export default Card;
