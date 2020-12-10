import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { ReactComponent as FavoriteStarIcon } from '../icons/favorites-star.svg';

const FilterSetsOption = ({
  handleUpdateFavorite,
  handleSelectFilter,
  activeId,
  filter,
}) => {
  const handleOptionClick = () => {
    if (activeId !== filter.uuid && handleSelectFilter) {
      handleSelectFilter(filter.uuid);
    }
  };

  const handleStarClick = (event) => {
    event.stopPropagation();
    handleUpdateFavorite(filter.uuid, !filter.favourite);
  };

  return (
    <Fragment key={filter.uuid}>
      <div
        className={classNames(
          'filter-favorites__dropdown-item',
          { 'is-active': activeId === filter.uuid },
        )}
        onClick={handleOptionClick}
      >
        <div
          className={classNames(
            'filter-favorites__dropdown-item-star',
            { 'is-active': filter.favourite },
          )}
          onClick={handleStarClick}
        >
          <FavoriteStarIcon />
        </div>

        <div className="filter-favorites__dropdown-item-title">{filter.name}</div>
      </div>
    </Fragment>
  );
};


FilterSetsOption.propTypes = {
  handleUpdateFavorite: PropTypes.func.isRequired,
  handleSelectFilter: PropTypes.func,
  filter: PropTypes.object,
  activeId: PropTypes.string,
};

FilterSetsOption.defaultProps = {
  filter: {},
  activeId: null,
  handleSelectFilter: null,
};


export default React.memo(FilterSetsOption);
