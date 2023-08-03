import React from 'react';
import classnames from 'classnames';
import { getStaticFileUrl } from 'config';
import { BrandToAuthorities } from '__generated__/types';
import './BrandItem.scss';

type Props = {
  brand: BrandToAuthorities,
  isActive?: boolean,
  onClick?: () => void,
};

const BrandItem = (props: Props) => {
  const { brand, onClick, isActive } = props;
  const { id, name } = brand;

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

export default React.memo(BrandItem);
