import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { getStaticFileUrl } from 'config';
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
    const { id } = brand || {};

    return (
      <div
        className={
          classnames('BrandItem', {
            'BrandItem--active': isActive,
          })
        }
        onClick={onClick}
      >
        <img
          className="BrandItem__image"
          src={getStaticFileUrl(id, 'choose-brand.svg')}
          alt={id}
          onError={(e) => { e.target.src = '/img/image-placeholder.svg'; }}
        />
        <div className="BrandItem__title">{id}</div>
      </div>
    );
  }
}

export default BrandItem;
