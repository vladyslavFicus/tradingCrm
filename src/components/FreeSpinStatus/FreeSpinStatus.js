import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Uuid from '../Uuid';
import PropTypes from '../../constants/propTypes';
import renderLabel from '../../utils/renderLabel';
import { statuses, statusesClassNames, statusesLabels } from '../../constants/free-spin';
import './FreeSpinStatus.scss';

class FreeSpinStatus extends Component {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
    blockName: PropTypes.string,
  };
  static defaultProps = {
    blockName: 'free-spin-status',
  };

  render() {
    const { freeSpin, blockName } = this.props;
    const className = statusesClassNames[status] || '';

    return (
      <div className={blockName}>
        <div className={classNames(`${blockName}__status`, className)}>
          {renderLabel(freeSpin.status, statusesLabels)}
        </div>
        {
          freeSpin.statusChangedDate &&
          <div className={`${blockName}__status-date`}>
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(freeSpin.statusChangedDate).format('DD.MM.YYYY HH:mm'),
            })}
          </div>
        }
        {
          status === statuses.PENDING &&
          <div className={`${blockName}__status-date`}>
            {I18n.t('COMMON.DATE_UNTIL', {
              date: moment.utc(data.startDate).format('DD.MM.YYYY HH:mm'),
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
      </div>
    );
  }
}

export default FreeSpinStatus;
