import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'constants/propTypes';
import './BrandItem.scss';

class BrandItem extends PureComponent {
  static propTypes = PropTypes.brand.isRequired;

  static defaultProps = {
    onClick: () => {},
    isActive: false,
  };

  render() {
    const { brand, onClick, isActive } = this.props;
    const { name, image } = brand || {};

    return (
      <div
        className={
          classnames('BrandItem', {
            'BrandItem--active': isActive,
          })
        }
        onClick={onClick}
      >
        <img className="BrandItem__image" alt={name} src={image} />
        <div className="BrandItem__title">{name}</div>
      </div>
    );
  }
}

export default BrandItem;
