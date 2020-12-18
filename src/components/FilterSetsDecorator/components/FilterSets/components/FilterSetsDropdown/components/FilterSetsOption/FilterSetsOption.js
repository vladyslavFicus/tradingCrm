import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import './FilterSetsOption.scss';

class FilterSetsOption extends PureComponent {
  static propTypes = {
    filterSet: PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string,
      favourite: PropTypes.bool,
    }).isRequired,
    selectFilterSet: PropTypes.func,
    updateFavouriteFilterSet: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectFilterSet: null,
  };

  handleOptionClick = () => {
    const {
      filterSet,
      selectFilterSet,
    } = this.props;

    if (selectFilterSet) {
      selectFilterSet(filterSet.uuid);
    }
  };

  handleIconClick = (event) => {
    const {
      filterSet: {
        uuid,
        favourite,
      },
      updateFavouriteFilterSet,
    } = this.props;

    event.stopPropagation();
    updateFavouriteFilterSet(uuid, !favourite);
  };

  render() {
    const {
      filterSet: {
        name,
        favourite,
      },
    } = this.props;

    return (
      <div
        className={classNames(
          'FilterSetsOption', { 'FilterSetsOption--favourite': favourite },
        )}
        onClick={this.handleOptionClick}
      >
        <div
          className="FilterSetsOption__icon"
          onClick={this.handleIconClick}
        >
          <FavoriteStarIcon className="FilterSetsOption__icon-symbol" />
        </div>
        <div className="FilterSetsOption__name">{name}</div>
      </div>
    );
  }
}

export default FilterSetsOption;
