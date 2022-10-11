import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { HierarchyBranch as OriginalHierarchyBranch } from '__generated__/types';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from 'constants/retentionStatuses';
import { branchTypes } from 'constants/hierarchyTypes';
import GridEmptyValue from 'components/GridEmptyValue';
import './GridAcquisitionStatus.scss';

type HierarchyBranch = Pick<OriginalHierarchyBranch, 'name' | 'branchType' | 'parentBranch'>;

type Props = {
  active?: boolean,
  acquisition: 'SALES' | 'RETENTION',
  status?: string,
  fullName: string,
  hierarchy?: {
    parentBranches: Array<HierarchyBranch>,
  },
};

const GridAcquisitionStatus = (props: Props) => {
  const {
    active,
    acquisition,
    status = '',
    fullName,
    hierarchy,
  } = props;

  // Get title and color depends on acquisition
  const statusTitle = acquisition === 'SALES' ? salesStatuses[status] : retentionStatuses[status];
  const color = acquisition === 'SALES' ? salesStatusesColor[status] : retentionStatusesColor[status];

  // Find hierarchy branches (desk and team)
  const branches = hierarchy ? hierarchy.parentBranches : null;

  let team: HierarchyBranch | undefined | null = null;
  let desk: HierarchyBranch | undefined | null = null;

  if (branches) {
    team = branches.find(branch => branch?.branchType === branchTypes.TEAM);
    desk = team ? team.parentBranch : branches.find(branch => branch.branchType === branchTypes.DESK);
  }

  return (
    <Choose>
      <When condition={!!status}>
        <div className={
          classNames(
            'GridAcquisitionStatus',
            `GridAcquisitionStatus--${color}`,
            { 'GridAcquisitionStatus--active': active },
          )}
        >
          <div className={classNames('GridAcquisitionStatus__general', `GridAcquisitionStatus__general--${color}`)}>
            {I18n.t(statusTitle)}
          </div>

          <div className="GridAcquisitionStatus__additional">
            <If condition={!!fullName}>
              <div>
                {fullName}
              </div>
            </If>
            <If condition={!!desk}>
              <div>
                <b>{I18n.t('DESKS.GRID_HEADER.DESK')}:</b> {(desk as HierarchyBranch).name}
              </div>
            </If>
            <If condition={!!team}>
              <div>
                <b>{I18n.t('TEAMS.GRID_HEADER.TEAM')}:</b> {(team as HierarchyBranch).name}
              </div>
            </If>
          </div>
        </div>
      </When>
      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );
};

GridAcquisitionStatus.defaultProps = {
  active: false,
  status: '',
  hierarchy: null,
};

export default React.memo(GridAcquisitionStatus);
