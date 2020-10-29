import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import LeadsList from './routes/LeadsList';
import Lead from './routes/Lead';

class Leads extends PureComponent {
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
        <Route path={`${path}/list`} component={LeadsList} />
        <Route path={`${path}/:id`} component={Lead} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default Leads;
