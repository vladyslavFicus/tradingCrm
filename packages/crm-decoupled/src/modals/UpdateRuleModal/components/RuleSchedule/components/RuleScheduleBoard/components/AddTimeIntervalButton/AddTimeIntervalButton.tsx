import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components';
import { ReactComponent as PlusIcon } from './plus-icon.svg';
import './AddTimeIntervalButton.scss';

const AddTimeIntervalButton = (props: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { className, onClick, ...rest } = props;

  return (
    <Button
      {...rest}
      className={classNames('AddTimeIntervalButton', className)}
      onClick={onClick}
    >
      <span>{I18n.t('RULE_MODAL.SCHEDULE.ADD_TIME_INTERVAL_BUTTON')}</span>

      <PlusIcon className="AddTimeIntervalButton__icon" />
    </Button>
  );
};

export default React.memo(AddTimeIntervalButton);
