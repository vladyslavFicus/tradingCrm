import React from 'react';
import classNames from 'classnames';
import { FilterSet__Option as FilterSet } from '__generated__/types';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import './FilterSetsOption.scss';

type Props = {
  filterSet: FilterSet,
  updateFavouriteFilterSet: (uuid: string, favourite: boolean) => void,
  selectFilterSet?: (uuid: string) => void,
};

const FilterSetsOption = (props: Props) => {
  const {
    filterSet: {
      uuid,
      name,
      favourite,
    },
    selectFilterSet,
    updateFavouriteFilterSet,
  } = props;

  const handleOptionClick = () => {
    if (selectFilterSet) {
      selectFilterSet(uuid);
    }
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    updateFavouriteFilterSet(uuid, !favourite);
  };

  return (
    <div
      className={classNames(
        'FilterSetsOption', { 'FilterSetsOption--favourite': favourite },
      )}
      onClick={handleOptionClick}
    >
      <div
        className="FilterSetsOption__icon"
        onClick={handleIconClick}
      >
        <FavoriteStarIcon className="FilterSetsOption__icon-symbol" />
      </div>

      <div className="FilterSetsOption__name">{name}</div>
    </div>
  );
};

export default React.memo(FilterSetsOption);
