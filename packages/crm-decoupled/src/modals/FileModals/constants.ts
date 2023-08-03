import { ManualNote } from 'types/Note';

export enum TargetTypes {
  PAYMENT_ACCOUNT = 'PAYMENT_ACCOUNT',
  FILES = 'FILES',
}

export type FileData = {
  fileUuid: string,
  error?: string,
  file?: File,
  fileNote?: ManualNote,
  uploading?: boolean,
  progress?: number,
};
