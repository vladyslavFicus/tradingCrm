import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const GridStatus = ({
  wrapperClassName,
  colorClassName,
  statusLabel,
  info,
  infoLabel,
}) => (
  <div className={wrapperClassName ? `grid-status-border ${wrapperClassName}` : ''}>
    <div className={classNames(colorClassName, 'text-uppercase font-weight-700')}>
      {statusLabel}
    </div>
    <If condition={info}>
      <div className="font-size-11">
        <Choose>
          <When condition={infoLabel && typeof infoLabel === 'function'}>
            {infoLabel(info)}
          </When>
          <Otherwise>
            {info}
          </Otherwise>
        </Choose>
      </div>
    </If>
  </div>
);

GridStatus.propTypes = {
  wrapperClassName: PropTypes.string,
  colorClassName: PropTypes.string.isRequired,
  statusLabel: PropTypes.string.isRequired,
  info: PropTypes.string,
  infoLabel: PropTypes.func,
};

GridStatus.defaultProps = {
  wrapperClassName: null,
  info: null,
  infoLabel: null,
};

export default GridStatus;
