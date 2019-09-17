import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';

const ViewSelectOption = ({
  onUpdateFavourite,
  onClick,
  activeId,
  data,
}) => {
  const handleOptionClick = () => {
    if (activeId !== data.uuid && onClick) {
      onClick(data.uuid);
    }
  };

  const handleFavouriteClick = (e) => {
    e.stopPropagation();

    onUpdateFavourite(data.uuid, !data.favourite);
  };

  return (
    <Fragment>
      <div
        className={classNames(
          'view-select-option',
          { active: activeId === data.uuid },
        )}
        onClick={handleOptionClick}
      >
        <div
          className={classNames(
            'favourite-star',
            { active: data.favourite },
          )}
          onClick={handleFavouriteClick}
        />
        {data.name}
      </div>
    </Fragment>
  );
};

ViewSelectOption.propTypes = {
  onUpdateFavourite: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  data: PropTypes.object,
  activeId: PropTypes.string,
};

ViewSelectOption.defaultProps = {
  data: {},
  onClick: null,
  activeId: null,
};

export default React.memo(ViewSelectOption);
