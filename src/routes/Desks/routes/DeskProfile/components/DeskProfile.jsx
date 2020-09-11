import React from 'react';
import { get } from 'lodash';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import { branchTypes } from 'constants/hierarchyTypes';
import { deskTypes } from 'constants/rules';
import NotFound from 'routes/NotFound';
import Route from 'components/Route';
import Tabs from 'components/Tabs';
import HierarchyProfileRules from 'components/HierarchyProfileRules';
import BranchHeader from 'components/BranchHeader';
import deskProfileTabs from './constants';

const RulesRetention = HierarchyProfileRules('DESKS.TABS.RULES.TITLE', deskTypes.RETENTION, branchTypes.DESK);
const RulesSales = HierarchyProfileRules('DESKS.TABS.RULES.TITLE', deskTypes.SALES, branchTypes.DESK);

const DeskProfile = ({
  deskProfile,
  deskProfile: { loading },
  location,
  match: { params, path },
}) => {
  const data = get(deskProfile, 'branchInfo') || {};
  const error = get(deskProfile, 'error');

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        <BranchHeader
          branchData={data}
          branchId={params.id}
          loading={loading}
        />
      </div>
      <Tabs
        items={deskProfileTabs}
        location={location}
        params={params}
      />
      <div className="card no-borders">
        <Switch>
          <Route path={`${path}/rules/sales-rules`} component={RulesSales} />
          <Route path={`${path}/rules/retention-rules`} component={RulesRetention} />
          <If condition={data?.deskType}>
            <Redirect to={`${path}/rules/${data.deskType.toLowerCase()}-rules`} />
          </If>
        </Switch>
      </div>
    </div>
  );
};

DeskProfile.propTypes = {
  deskProfile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    branchInfo: PropTypes.hierarchyBranch,
    refetch: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeskProfile;
