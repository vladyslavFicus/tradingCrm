import React from 'react';
import PropTypes from 'prop-types';

const BrandItem = ({ className, name, image, onClick }) => (
  <div className={className} onClick={onClick}>
    <img {...image} alt={name} className="choice-item__image" />
    <div className="choice-item__label">
      {name}
    </div>
  </div>
);
BrandItem.propTypes = {
  className: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    style: PropTypes.shape({
      width: PropTypes.string,
      height: PropTypes.string,
    }),
  }).isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
BrandItem.defaultProps = {
  className: 'choice-item',
};

export default BrandItem;
