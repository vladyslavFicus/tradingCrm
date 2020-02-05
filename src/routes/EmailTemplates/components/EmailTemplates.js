import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import EmailTemplatesList from '../routes/EmailTemplatesList';
import EmailTemplatesCreator from '../routes/EmailTemplatesCreator';
import EmailTemplatesEditor from '../routes/EmailTemplatesEditor';

class EmailTemplates extends PureComponent {
  propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { match: { path, url } } = this.props;

    return (
      <Switch>
        <Route path={`${path}/list`} component={EmailTemplatesList} />
        <Route path={`${path}/edit/:id`} component={EmailTemplatesEditor} />
        <Route path={`${path}/create`} component={EmailTemplatesCreator} />
        <Redirect to={`${url}/list`} />
      </Switch>
    );
  }
}

export default EmailTemplates;
