import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import EmailTemplatesList from './routes/EmailTemplatesList';
import EmailTemplatesCreator from './routes/EmailTemplatesCreator';
import EmailTemplatesEditor from './routes/EmailTemplatesEditor';

const EmailTemplates = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={EmailTemplatesList} />
      <Route path={`${path}/edit/:id`} component={EmailTemplatesEditor} />
      <Route path={`${path}/create`} component={EmailTemplatesCreator} />
      <Redirect to={`${url}/list`} />
    </Switch>
  );
};

export default React.memo(EmailTemplates);
