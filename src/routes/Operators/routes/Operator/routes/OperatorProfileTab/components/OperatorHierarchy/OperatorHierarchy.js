import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import OperatorHierarchyUserType from './components/OperatorHierarchyUserType';
import OperatorHierarchyBranches from './components/OperatorHierarchyBranches';
import './OperatorHierarchy.scss';

class OperatorHierarchy extends PureComponent {
  static propTypes = {
    auth: PropTypes.auth.isRequired,
    permission: PropTypes.permission.isRequired,
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
  }

  render() {
    const {
      auth,
      operatorQuery,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const operator = operatorQuery.data?.operator || {};

    const updateBranchPermission = new Permissions(permissions.HIERARCHY.UPDATE_USER_BRANCH);
    const allowToUpdateHierarchy = updateBranchPermission.check(currentPermissions) && auth.uuid !== operator.uuid;

    return (
      <div className="OperatorHierarchy">
        <div className="OperatorHierarchy__title">
          {I18n.t('OPERATORS.PROFILE.HIERARCHY.LABEL')}
        </div>

        <OperatorHierarchyUserType
          operatorQuery={operatorQuery}
          allowToUpdateHierarchy={allowToUpdateHierarchy}
        />

        <hr />

        <div className="OperatorHierarchy__title">
          {I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCHES')}
        </div>

        <OperatorHierarchyBranches
          operatorQuery={operatorQuery}
          allowToUpdateHierarchy={allowToUpdateHierarchy}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withPermission,
  withStorage(['auth']),
)(OperatorHierarchy);
