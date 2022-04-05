import { LoginLock } from '__generated__/types';

export const isPasswordExpired = (status: LoginLock) => status && status.isLocked
  && status.locks.some(lock => lock.lockReason === 'password.expired');

export const isMaxLoginAttemptReached = (status: LoginLock) => status && status.isLocked
  && status.locks.some(lock => lock.lockReason === 'max.failed.sign.in.attempts.reached');
