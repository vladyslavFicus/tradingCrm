import React from 'react';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import Route from 'components/Route';
import DocumentsFeed from './components/DocumentsFeed';
import DocumentsTable from './components/DocumentsGrid';

const Documents = ({ match: { path, url } }: RouteComponentProps) => (
  <div className="Documents">
    <Switch>
      <Route path={`${path}/list`} component={DocumentsTable} />
      <Route path={`${path}/feed`} component={DocumentsFeed} />

      <Redirect to={`${url}/list`} />
    </Switch>
  </div>
);

export default Documents;
