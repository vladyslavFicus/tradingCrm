import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RisksResult extends Component {
  static propTypes = {
    calcData: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      score: PropTypes.number,
    })).isRequired,
  };

  renderGroupCalculationResult = ({ title, score }, key) => {
    const result = score !== null ? score : '--';

    return (
      <If condition={title}>
        <div className="risk__result-data" key={key}>
          {title}: {result}
        </div>
      </If>
    );
  };

  render() {
    const { calcData } = this.props;

    return (
      <div className="card">
        <div className="card-body">
          {calcData.map((data, key) => this.renderGroupCalculationResult(data, key))}
        </div>
      </div>
    );
  }
}

export default RisksResult;
