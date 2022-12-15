import React from 'react';
import { toast } from 'react-toastify';
import Notification from './components/Notification';
import { LevelType } from './types';

type Options = {
  level: LevelType,
  title: string,
  message: string,
};

const notify = (options: Options) => {
  toast(<Notification {...options} />);
};

export default notify;
