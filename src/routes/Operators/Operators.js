import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import List from './routes/List';
import Operator from './routes/Operator';

class Operators extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }

  render() {
    const { match: { path, url } } = this.props;

    return (
      <Switch>
        <Route path={`${path}/list`} component={List} />
        <Route path={`${path}/:id`} component={Operator} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Operators;
