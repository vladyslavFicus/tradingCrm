import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from 'constants/retentionStatuses';
import { branchTypes } from 'constants/hierarchyTypes';
import GridEmptyValue from 'components/GridEmptyValue';
import HideText from 'components/HideText';
import './GridAcquisitionStatus.scss';

type ParentBranch = {
  name: string,
  branchType: string,
  parentBranch?: {
    name: string,
    branchType: string,
  } | null,
};

type Hierarchy = {
  parentBranches?: Array<ParentBranch> | null,
} | null;

type Props<HierarchyBranches> = {
  active?: boolean,
  acquisition: 'SALES' | 'RETENTION',
  status?: string,
  fullName: string,
  hierarchy?: HierarchyBranches,
};

const GridAcquisitionStatus = <HierarchyBranches extends Hierarchy>(props: Props<HierarchyBranches>) => {
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

  const team = branches?.find(branch => branch?.branchType === branchTypes.TEAM);
  const desk = team ? team.parentBranch : branches?.find(branch => branch?.branchType === branchTypes.DESK);

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
              <p>
                {fullName}
              </p>
            </If>

            <If condition={!!desk}>
              <p>
                <b>{I18n.t('DESKS.GRID_HEADER.DESK')}:</b> <HideText text={desk?.name || ''} />
              </p>
            </If>

            <If condition={!!team}>
              <b>{I18n.t('TEAMS.GRID_HEADER.TEAM')}:</b> <HideText text={team?.name || ''} />
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

export default React.memo(GridAcquisitionStatus);
