import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import './TemporaryUntil.scss';

const TemporaryUntil = ({ temporaryUntil }) => {
  const temporaryDate = moment.utc(temporaryUntil).local().format('DD.MM.YYYY HH:mm');
  const blocked = moment().isBefore(temporaryDate);
  
  return (
    <div className={classNames('temporary-until', { blocked })}>
      <Choose>
        <When condition={blocked}>
          {I18n.t('TEMPORARY_UNTIL.BLOCKED', {
            date: temporaryDate,
          })}
        </When>
        <Otherwise>
          {I18n.t('TEMPORARY_UNTIL.WILL_BE_BLOCKED', {
            date: temporaryDate,
          })}
        </Otherwise>
      </Choose>
    </div>
  );
};

TemporaryUntil.propTypes = {
  temporaryUntil: PropTypes.string.isRequired,
};

export default TemporaryUntil;
