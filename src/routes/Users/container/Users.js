import React, { Component } from 'react';
import List from '../components/List';

class Users extends Component {
  render() {
    const { children, content: nestedContent, params } = this.props;
    let content = <List params={params}/>;

    if (children) {
      content = children;
    } else if (nestedContent) {
      content = nestedContent;
    }

    return <div>{ content }</div>;
  }
}

export default Users;
