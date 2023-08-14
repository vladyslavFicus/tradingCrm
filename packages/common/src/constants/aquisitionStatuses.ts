import { AcquisitionStatusTypes__Enum as AcquisitionStatusEnum } from '__generated__/types';

type AquisitionStatus = {
  value: AcquisitionStatusEnum,
  label: string,
};

export const aquisitionStatuses: Array<AquisitionStatus> = [
  {
    value: AcquisitionStatusEnum.SALES,
    label: 'COMMON.AQUISITION_STATUSES.SALES',
  },
  {
    value: AcquisitionStatusEnum.RETENTION,
    label: 'COMMON.AQUISITION_STATUSES.RETENTION',
  },
];
