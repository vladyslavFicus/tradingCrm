import React from 'react';
import classnames from 'classnames';
import PropTypes from 'constants/propTypes';

const BrandItem = ({ name, image, onClick, isActive }) => (
  <div
    className={
      classnames('brands__item choice-item', {
        'is-active': isActive,
      })
    }
    onClick={onClick}
  >
    <img className="brands__item-image" alt={name} {...image} />
    <div className="brands__item-title choice-item__label">{name}</div>
  </div>
);

BrandItem.propTypes = PropTypes.brand.isRequired;

BrandItem.defaultProps = {
  onClick: () => {},
  isActive: false,
};

export default BrandItem;
