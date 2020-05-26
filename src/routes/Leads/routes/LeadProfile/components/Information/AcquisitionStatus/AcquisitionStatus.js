import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { branchTypes } from 'constants/hierarchyTypes';
import './AcquisitionStatus.scss';

const changeAcquisitionStatus = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS]);

class AcquisitionStatus extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      salesStatus: PropTypes.string,
      salesAgent: PropTypes.shape({
        fullName: PropTypes.string,
        uuid: PropTypes.string,
        hierarchy: PropTypes.shape({
          parentBranches: PropTypes.array,
        }),
      }),
    }),
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  static contextTypes = {
    triggerRepresentativeUpdateModal: PropTypes.func.isRequired,
  };

  render() {
    const {
      data: { salesStatus, salesAgent },
      loading,
      permission: { permissions: currentPermissions },
    } = this.props;

    const { triggerRepresentativeUpdateModal } = this.context;

    let team = null;
    let desk = null;

    if (salesAgent) {
      const branches = salesAgent.hierarchy ? salesAgent.hierarchy.parentBranches : null;
      // Find operator team and desk. If team is absent -> find desk in branches

      if (branches) {
        team = branches.find(branch => branch.branchType === branchTypes.TEAM);
        desk = team ? team.parentBranch : branches.find(branch => branch.branchType === branchTypes.DESK);
      }
    }

    const colorClassName = salesStatus && salesStatusesColor[salesStatus];

    return (
      <div className="account-details__personal-info">
        <span className="account-details__label">
          {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
        </span>
        <div className="card">
          <div className="card-body acquisition-status">
            <If condition={!loading}>
              <div
                className={
                  classNames(
                    'acquisition-item',
                    { [`border-${colorClassName}`]: colorClassName },
                  )
                }
                onClick={
                  changeAcquisitionStatus.check(currentPermissions)
                    ? triggerRepresentativeUpdateModal
                    : null
                }
              >
                <div className="status-col">
                  <div>{I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.SALES')}</div>
                  <Choose>
                    <When condition={salesStatus}>
                      <div className={classNames('status', colorClassName)}>
                        {I18n.t(salesStatuses[salesStatus])}
                      </div>
                    </When>
                    <Otherwise>
                      <span>&mdash;</span>
                    </Otherwise>
                  </Choose>
                </div>
                <div className="operator-col">
                  <div>
                    <Choose>
                      <When condition={salesAgent}>
                        {salesAgent.fullName}
                      </When>
                      <Otherwise>
                        <span>&mdash;</span>
                      </Otherwise>
                    </Choose>
                  </div>
                  <div className="name">
                    <If condition={desk}>
                      <div>
                        <b>{I18n.t('DESKS.GRID_HEADER.DESK')}:</b> {desk.name}
                      </div>
                    </If>
                    <If condition={team}>
                      <div>
                        <b>{I18n.t('TEAMS.GRID_HEADER.TEAM')}:</b> {team.name}
                      </div>
                    </If>
                  </div>
                </div>
              </div>
            </If>
          </div>
        </div>
      </div>
    );
  }
}

export default withPermission(AcquisitionStatus);