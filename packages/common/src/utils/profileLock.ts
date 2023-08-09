// import { LoginLock } from '__generated__/types';

// TODO: fix LoginLock type
export const isPasswordExpired = (status: any) => status && status.isLocked
  && status.locks.some((lock: { lockReason: string }) => lock.lockReason === 'password.expired');

export const isMaxLoginAttemptReached = (status: any) => status && status.isLocked
  && status.locks.some((lock: { lockReason: string }) => lock.lockReason === 'max.failed.sign.in.attempts.reached');
