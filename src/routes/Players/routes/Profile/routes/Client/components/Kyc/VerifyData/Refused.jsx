import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Uuid from '../../../../../../../../../components/Uuid';
import PropTypes from '../../../../../../../../../constants/propTypes';
import PermissionContent from '../../../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../../../config/permissions';

const Refused = ({ title, onVerify, status }) => (
  <div className="panel-body__content-container">
    <div className="panel-body__content">
      <div className="margin-bottom-10">
        <div className="font-size-18 font-weight-700 color-danger">
          <i className="fa fa-exclamation-triangle" /> {' '}
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.TYPE_VERIFICATION_REFUSED', { title })}
        </div>
        <div className="font-size-11 color-default ">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={status.authorUUID} />
          {I18n.t('COMMON.DATE_ON', {
            date: moment.utc(status.statusDate).local().format('DD.MM.YYYY \\a\\t HH:mm:ss'),
          })}
        </div>
      </div>
      <div className="pb-4">
        <div className="font-weight-700 text-uppercase">
          {I18n.t('COMMON.REASON')}:
        </div>
        <div className="font-italic font-size-12">{status.reason}</div>
      </div>
      <div className="font-size-11 color-default text-uppercase">
        {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.REQUEST_STATUS')}
      </div>
      <div className="color-primary font-size-16">
        {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.WAITING_FOR_DOCUMENTS')}
      </div>
      <div className="font-size-11 color-default">
        {I18n.t('COMMON.SINCE', { date: moment.utc(status.statusDate).local().format('DD.MM.YYYY \\a\\t HH:mm') })}
      </div>
    </div>

    <div className="panel-body__buttons">
      <PermissionContent permissions={permissions.USER_PROFILE.KYC_VERIFY}>
        <button
          onClick={onVerify}
          type="button"
          className="btn btn-success-outline"
        >
          {I18n.t('PLAYER_PROFILE.PROFILE.KYC_VERIFICATION.ACTIONS.VERIFY')} {title.toLowerCase()}
        </button>
      </PermissionContent>
    </div>
  </div>
);

Refused.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.kycStatus.isRequired,
  onVerify: PropTypes.func.isRequired,
};

export default Refused;
