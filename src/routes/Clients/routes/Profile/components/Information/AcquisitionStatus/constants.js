import { departments } from 'constants/brands';
import { aquisitionStatuses, aquisitionStatusesNames } from 'constants/aquisitionStatuses';
import { salesStatusesColor, salesStatuses } from 'constants/salesStatuses';
import { retentionStatusesColor, retentionStatuses } from 'constants/retentionStatuses';
import renderLabel from 'utils/renderLabel';

const transformAcquisitionData = (data, department) => aquisitionStatuses.map(({ value, label }) => {
  const type = value.toLowerCase();
  const {
    [`${type}Status`]: status,
    [`${type}Rep`]: representative,
    aquisitionStatus,
  } = data;

  switch (value) {
    case aquisitionStatusesNames.SALES: {
      const statusColor = salesStatusesColor[status];

      return {
        label,
        statusColor,
        statusLabel: renderLabel(status, salesStatuses),
        borderColor: aquisitionStatus === value ? statusColor : null,
        repName: representative.fullName,
        modalType: value,
        allowAction: department !== departments.RETENTION,
      };
    }
    case aquisitionStatusesNames.RETENTION: {
      const statusColor = retentionStatusesColor[status];

      return {
        label,
        statusColor,
        statusLabel: renderLabel(status, retentionStatuses),
        borderColor: aquisitionStatus === value ? statusColor : null,
        repName: representative.fullName,
        modalType: value,
        allowAction: department !== departments.SALES,
      };
    }
    default:
      return {};
  }
});

export default transformAcquisitionData;
