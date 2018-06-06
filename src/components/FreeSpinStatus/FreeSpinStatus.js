import React, { Fragment } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Uuid from '../Uuid';
import PropTypes from '../../constants/propTypes';
import renderLabel from '../../utils/renderLabel';
import { statuses, statusesClassNames, statusesLabels } from '../../constants/free-spin';
import Amount from '../Amount';
import FailedStatusIcon from '../FailedStatusIcon';

const FreeSpinStatus = (props) => {
  const {
    id,
    freeSpin: {
      status,
      reason,
      error,
      statusChangedDate,
      freeSpinStatus,
      startDate,
      statusChangedAuthorUUID,
      winning,
    },
  } = props;

  const className = statusesClassNames[status] || '';

  return (
    <Fragment>
      <div className={classNames('text-uppercase font-weight-700', className)}>
        {renderLabel(status, statusesLabels)}
        <If condition={reason || error}>
          <FailedStatusIcon id={`${id}-status`}>
            {reason || error}
          </FailedStatusIcon>
        </If>
      </div>
      <If condition={statusChangedDate}>
        <div className="font-size-11">
          {I18n.t('COMMON.DATE_ON', {
            date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </If>
      <If condition={freeSpinStatus === statuses.PENDING}>
        <div className="font-size-11">
          {I18n.t('COMMON.DATE_UNTIL', {
            date: moment.utc(startDate).local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </If>
      <If condition={statusChangedAuthorUUID}>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')}
          <Uuid uuid={statusChangedAuthorUUID} />
        </div>
      </If>
      <If condition={status === statuses.PLAYED && winning}>
        <div className="font-size-11">
          {I18n.t('COMMON.TOTAL_WIN')}: <Amount {...winning} />
        </div>
      </If>
    </Fragment>
  );
};

FreeSpinStatus.propTypes = {
  id: PropTypes.string.isRequired,
  freeSpin: PropTypes.freeSpinEntity.isRequired,
};

export default FreeSpinStatus;
