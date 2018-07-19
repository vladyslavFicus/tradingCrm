import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import './TemporaryAccount.scss';

const TemporaryAccount = ({ status, blockDate }) => {
  const blockDateFormat = moment(blockDate).local().format('DD.MM.YYYY HH:mm');

  return (
    <div className={classNames('temporary-account', { blocked: status === 'blocked' })}>
      <Choose>
        <When condition={status === 'blocked'}>
          {I18n.t('TEMPORARY_ACCOUNT.BLOCKED', {
            date: blockDateFormat,
          })}
        </When>
        <Otherwise>
          {I18n.t('TEMPORARY_ACCOUNT.WILL_BE_BLOCKED', {
            date: blockDateFormat,
          })}
        </Otherwise>
      </Choose>
    </div>
  );
};

TemporaryAccount.propTypes = {
  status: PropTypes.oneOf([
    'blocked', 'will-be-blocked',
  ]),
  blockDate: PropTypes.string,
};
TemporaryAccount.defaultProps = {
  status: 'will-be-blocked',
  blockDate: null,
};

export default TemporaryAccount;
