import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Uuid from '../Uuid';
import PropTypes from '../../constants/propTypes';
import renderLabel from '../../utils/renderLabel';
import { statuses, statusesClassNames, statusesLabels } from '../../constants/free-spin';
import './FreeSpinStatus.scss';
import Amount from '../Amount';
import FailedStatusIcon from '../FailedStatusIcon';

class FreeSpinStatus extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    freeSpin: PropTypes.freeSpinEntity.isRequired,
    blockName: PropTypes.string,
  };
  static defaultProps = {
    blockName: 'free-spin-status',
  };

  render() {
    const { id, freeSpin, blockName } = this.props;
    const className = statusesClassNames[freeSpin.status] || '';

    return (
      <div className={blockName}>
        <div className={classNames(`${blockName}__status`, className)}>
          {renderLabel(freeSpin.status, statusesLabels)}
          {
            (freeSpin.reason || freeSpin.error) &&
            <FailedStatusIcon id={`${id}-status`}>
              {freeSpin.error || freeSpin.reason}
            </FailedStatusIcon>
          }
        </div>
        {
          freeSpin.statusChangedDate &&
          <div className={`${blockName}__status-date`}>
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(freeSpin.statusChangedDate).local().format('DD.MM.YYYY HH:mm'),
            })}
          </div>
        }
        {
          freeSpin.freeSpinStatus === statuses.PENDING &&
          <div className={`${blockName}__status-date`}>
            {I18n.t('COMMON.DATE_UNTIL', {
              date: moment.utc(freeSpin.startDate).local().format('DD.MM.YYYY HH:mm'),
            })}
          </div>
        }
        {
          freeSpin.statusChangedAuthorUUID &&
          <div className={`${blockName}__status-author`}>
            {I18n.t('COMMON.AUTHOR_BY')}
            <Uuid uuid={freeSpin.statusChangedAuthorUUID} />
          </div>
        }
        {
          freeSpin.freeSpinStatus === statuses.PLAYED && freeSpin.winning &&
          <div className={`${blockName}__status-additional`}>
            {I18n.t('COMMON.TOTAL_WIN')}: <Amount {...freeSpin.winning} />
          </div>
        }
      </div>
    );
  }
}

export default FreeSpinStatus;
