import React from 'react';
import classNames from 'classnames';
import { FilterSet__Option as FilterSet } from '__generated__/types';
import useFilterSetsOption from 'components/FilterSetsDecorator/hooks/useFilterSetsOption';
import {
  ReactComponent as FavoriteStarIcon,
} from 'components/FilterSetsDecorator/layouts/icons/favorites-star.svg';
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

  const {
    handleOptionClick,
    handleIconClick,
  } = useFilterSetsOption({ uuid, favourite, selectFilterSet, updateFavouriteFilterSet });

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
