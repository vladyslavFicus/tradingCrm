import React from 'react';
import PropTypes from '../../../../../../constants/propTypes';
import './ChartFooter.scss';

const ChartFooter = ({ noResults, total, color, title }) => (
  <div className="chart-footer">
    <div className="chart-footer__total">
      <div>{title}</div>
      <div style={{ color }}>
        <Choose>
          <When condition={noResults || total === 0}>
            <span>&mdash;</span>
          </When>
          <Otherwise>{total}</Otherwise>
        </Choose>
      </div>
    </div>
  </div>
);

ChartFooter.propTypes = {
  noResults: PropTypes.bool.isRequired,
  total: PropTypes.number,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

ChartFooter.defaultProps = {
  total: 0,
};

export default ChartFooter;
