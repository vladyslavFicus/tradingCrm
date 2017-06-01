import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SimpleRow extends Component {
  render() {
    const { id, label, data } = this.props;

    return (
      <div key={id} className="form-group row">
        <label className="col-sm-1 col-form-label text-right"> { label } </label>
        <div className="col-sm-10">
          { data }
        </div>
      </div>
    );
  }
}

SimpleRow.propTypes = {
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default SimpleRow;
