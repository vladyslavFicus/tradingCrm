export enum LevelType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export type Notify = (values: { level: LevelType, title: string, message?: string }) => void
