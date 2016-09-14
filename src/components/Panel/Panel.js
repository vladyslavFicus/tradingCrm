import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Panel extends Component {
  static defaultProps = {
    withBorders: false,
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    withBorders: PropTypes.bool,
  }

  render() {
    const { children, withBorders } = this.props;

    return <section className={classNames(['panel', { 'panel-with-borders': withBorders }])}>
      {children}
    </section>;
  }
}
