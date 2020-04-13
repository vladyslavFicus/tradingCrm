import React from 'react';
import { get } from 'lodash';
import { Switch } from 'react-router-dom';
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
  deskProfile: {
    hierarchy,
    loading,
  },
  location,
  match: { params, path },
}) => {
  const data = get(hierarchy, 'branchInfo.data') || {};
  const error = get(hierarchy, 'branchInfo.error');

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
        </Switch>
      </div>
    </div>
  );
};

DeskProfile.propTypes = {
  deskProfile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    hierarchy: PropTypes.shape({
      branchInfo: PropTypes.shape({
        data: PropTypes.hierarchyBranch,
        error: PropTypes.object,
      }),
    }),
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
