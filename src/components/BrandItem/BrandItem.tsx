import React from 'react';
import classnames from 'classnames';
import { getStaticFileUrl } from 'config';
import './BrandItem.scss';

type Props = {
  brand: Brand,
  isActive?: boolean,
  onClick?: () => void,
}

type Brand = {
  id: string,
  name: string,
}

const BrandItem = (props: Props) => {
  const {
    onClick,
    isActive,
    brand: {
      id,
      name,
    },
  } = props;

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
        onError={(e) => { e.currentTarget.src = '/img/image-placeholder.svg'; }}
      />
      <div className="BrandItem__title">{name}</div>
    </div>
  );
};

BrandItem.defaultProps = {
  onClick: () => {},
  isActive: false,
};

export default BrandItem;
