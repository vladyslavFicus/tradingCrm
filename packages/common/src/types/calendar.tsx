import { CallbackType } from '../constants';

export type Range = {
  start: Date,
  end: Date,
};

export type Event<TCallback> = {
  title: string,
  callback: TCallback,
  callbackType: CallbackType,
} & Range;
