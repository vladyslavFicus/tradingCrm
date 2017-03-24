import React, { Component } from 'react';

class SubMenuItem extends Component {
  render() {
    const {
      label,
      url,
    } = this.props;

    return (

      <a className="dropdown-item" href={url}>{label}</a>

    );
  }
}


export default SubMenuItem;
