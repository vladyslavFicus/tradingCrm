import { useMemo } from 'react';
import { Constants } from '@crm/common';

export type ParentBranch = {
  name: string,
  branchType: string,
  parentBranch?: {
    name: string,
    branchType: string,
  } | null,
};

export type Hierarchy = {
  parentBranches?: Array<ParentBranch> | null,
};

type Props = {
  acquisition: 'SALES' | 'RETENTION',
  status?: string,
  hierarchy?: Hierarchy,
};

const useGridAcquisitionStatus = (props: Props) => {
  const {
    acquisition,
    status = '',
    hierarchy,
  } = props;

  // Get title and color depends on acquisition
  const statusTitle = acquisition === 'SALES'
    ? Constants.salesStatuses[status]
    : Constants.retentionStatuses[status];
  const color = acquisition === 'SALES'
    ? Constants.salesStatusesColor[status]
    : Constants.retentionStatusesColor[status];

  // Find hierarchy branches (desk and team)
  const branches = hierarchy ? hierarchy.parentBranches : null;

  const team = useMemo(() => branches?.find(branch => branch?.branchType === Constants.branchTypes.TEAM), [branches]);
  const desk = useMemo(() => (team ? team.parentBranch
    : branches?.find(branch => branch?.branchType === Constants.branchTypes.DESK)), [branches, team]);

  return {
    statusTitle,
    color,
    team,
    desk,
  };
};

export default useGridAcquisitionStatus;
