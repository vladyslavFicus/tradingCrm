import { CallbackType } from './callbacks';

export type Event<T> = {
  title: string,
  start: Date,
  end: Date,
  callback: T,
  callbackType: CallbackType,
};
