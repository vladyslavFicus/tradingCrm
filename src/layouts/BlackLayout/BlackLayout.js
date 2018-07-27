import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import config from '../../config/index';
import { markets } from '../../constants/markets';
import './BlackLayout.scss';

const BlackLayout = ({
  children,
}) => (
  <div
    className={classNames(
      { 'casino-background': config.market !== markets.crm },
      { 'crm-background': config.market === markets.crm },
    )}
  >
    {children}
  </div>
);

BlackLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlackLayout;
