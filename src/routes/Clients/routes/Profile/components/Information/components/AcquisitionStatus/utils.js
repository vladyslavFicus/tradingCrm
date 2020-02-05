import { departments } from 'constants/brands';
import { aquisitionStatuses, aquisitionStatusesNames } from 'constants/aquisitionStatuses';
import { salesStatusesColor, salesStatuses } from 'constants/salesStatuses';
import { retentionStatusesColor, retentionStatuses } from 'constants/retentionStatuses';
import { branchTypes } from 'constants/hierarchyTypes';
import renderLabel from 'utils/renderLabel';

const transformAcquisitionData = (data, department) => aquisitionStatuses.map(({ value, label }) => {
  const type = value.toLowerCase();
  const {
    [`${type}Status`]: status,
    [`${type}Operator`]: operator,
    acquisitionStatus,
  } = data;

  let team = null;
  let desk = null;

  if (operator) {
    const branches = operator.hierarchy ? operator.hierarchy.parentBranches : null;

    // INFO: Find operator team and desk. If team is absent -> find desk in branches
    if (branches) {
      team = branches.find(branch => branch.branchType === branchTypes.TEAM);
      desk = team ? team.parentBranch : branches.find(branch => branch.branchType === branchTypes.DESK);
    }
  }

  switch (value) {
    case aquisitionStatusesNames.SALES: {
      const statusColor = salesStatusesColor[status];

      return {
        label,
        statusColor,
        statusLabel: renderLabel(status, salesStatuses),
        borderColor: acquisitionStatus === value ? statusColor : null,
        repName: operator && operator.fullName,
        modalType: value,
        allowAction: department !== departments.RETENTION,
        team,
        desk,
      };
    }
    case aquisitionStatusesNames.RETENTION: {
      const statusColor = retentionStatusesColor[status];

      return {
        label,
        statusColor,
        statusLabel: renderLabel(status, retentionStatuses),
        borderColor: acquisitionStatus === value ? statusColor : null,
        repName: operator && operator.fullName,
        modalType: value,
        allowAction: department !== departments.SALES,
        team,
        desk,
      };
    }
    default:
      return {};
  }
});

export default transformAcquisitionData;
