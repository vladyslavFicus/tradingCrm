import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import './FilterSetsOption.scss';

class FilterSetsOption extends PureComponent {
  static propTypes = {
    filter: PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string,
      favourite: PropTypes.bool,
    }).isRequired,
    selectFilter: PropTypes.func,
    updateFavouriteFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectFilter: null,
  };

  handleOptionClick = () => {
    const {
      filter,
      selectFilter,
    } = this.props;

    if (selectFilter) {
      selectFilter(filter.uuid);
    }
  };

  handleIconClick = (event) => {
    const {
      filter: {
        uuid,
        favourite,
      },
      updateFavouriteFilter,
    } = this.props;

    event.stopPropagation();
    updateFavouriteFilter(uuid, !favourite);
  };

  render() {
    const {
      filter: {
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
