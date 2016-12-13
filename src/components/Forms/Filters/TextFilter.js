import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class TextFilter extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = _.debounce(this.handleChange.bind(this), 300);
  }

  handleChange(value) {
    this.props.onFilterChange({ [this.props.name]: value });
  }

  render() {
    return <input
      type="text"
      className="form-control"
      onChange={(e) => this.handleChange(e.target.value)}
    />;
  }
}

TextFilter.propTypes = {
  name: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TextFilter;
