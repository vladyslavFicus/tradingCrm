import { Types } from '@crm/common';

export enum TargetTypes {
  PAYMENT_ACCOUNT = 'PAYMENT_ACCOUNT',
  FILES = 'FILES',
}

export type FileData = {
  fileUuid: string,
  error?: string,
  file?: File,
  fileNote?: Types.ManualNote,
  uploading?: boolean,
  progress?: number,
};
